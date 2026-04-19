# Plan: Implement Public Reviews API (Backend)

## Goal
Implement `/api/reviews` endpoints to support dynamic hotel/tour review loading

## Background
- Frontend uses `reviews-service.js` which calls `/api/reviews` when API connected
- Currently only manager reviews API exists (`/api/manager/content/reviews`)
- Need public API for reading/writing reviews on any item (hotel, tour, destination, etc.)

## Requirements

### 1. Create Reviews Database Model
- Fields: id, type, itemId, user, rating, text, date, helpful, status
- Status: pending (default), approved, rejected, flagged

### 2. GET /api/reviews
**Query Parameters:**
- type (required): hotels, tours, destinations, products, experiences
- itemId (optional): Filter by specific item
- rating (optional): Filter by star rating 1-5

**Behavior:**
- Only returns approved reviews (status = approved)
- If not connected to API, falls back to mockReviews in service

### 3. POST /api/reviews
**Request Body:**
```json
{
  "type": "hotels",
  "itemId": "h123",
  "rating": 5,
  "text": "Amazing experience!",
  "user": "John D."
}
```

**Behavior:**
- Creates review with status = pending (requires moderation)
- Returns created review

### Booking Verification (Required)
Only users who have booked/visited should submit reviews.

**Backend validation:**
```javascript
// POST /api/reviews handler
async (req, res) => {
    const user = req.user; // from JWT
    const { type, itemId } = req.body;
    
    // Verify user has completed booking for this item
    const booking = await Booking.findOne({
        userId: user.id,
        itemId: itemId,
        itemType: type,  // hotels, tours
        status: { $in: ['confirmed', 'completed'] },
        endDate: { $lte: new Date() } // already completed
    });
    
    if (!booking) {
        return res.status(403).json({
            success: false,
            message: 'You must have a completed booking to review'
        });
    }
}
```

**Frontend check (before showing submit form):**
```javascript
// Check if user can review - must have RECENT attendance
MutsBookingsService.getByFilter({ 
    status: 'completed',
    itemType: 'hotels', 
    itemId: hotelId 
}).then(bookings => {
    if (bookings.length > 0) {
        // Show "Write a Review" button
    } else {
        // Show "Only guests who have booked can review"
    }
});
```

### Recent Attendance Rule
Users can only review if they attended **within the last 90 days** (or configurable).

**Backend validation:**
```javascript
const RECENT_DAYS = 90;

const booking = await Booking.findOne({
    userId: user.id,
    itemId: itemId,
    itemType: type,
    status: { $in: ['confirmed', 'completed'] },
    endDate: { 
        $gte: new Date(Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000),
        $lte: new Date()
    }
});

if (!booking) {
    return res.status(403).json({
        success: false,
        message: 'You must have attended within the last 90 days to review'
    });
}
```

**Frontend - Show recent bookings to review:**
```javascript
// Get user's recent bookings (last 90 days) for review eligibility
async function getRecentBookingsForReview() {
    const DAYS = 90;
    const cutoff = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);
    
    return MutsBookingsService.getByFilter({
        status: 'completed',
        dateTo: cutoff.toISOString().split('T')[0] // completed in last 90 days
    });
}
```

### 4. PUT /api/reviews/:id/helpful
Mark a review as helpful

### 5. Integration with Item Endpoints
Optionally include review summary in item responses:
```json
// GET /api/hotels
{
  "hotels": [...],
  "reviews": { "average": 4.5, "count": 78 }
}

// GET /api/hotels/:id
{
  "hotel": {...},
  "reviews": [...]
}
```

## Steps

### Step 1: Database
- Create reviews table/model
- Add status field (pending/approved/rejected/flagged)

### Step 2: API Routes
- GET /api/reviews - List reviews (with filters)
- POST /api/reviews - Create review
- PUT /api/reviews/:id/helpful - Mark helpful

### Step 3: Moderation Integration
- Reviews default to pending status
- Manager approves via existing `/api/manager/content/reviews/:id/approve`
- Frontend can show pending reviews to author

### Step 4: Update Frontend (Future)
- Check reviews exist before showing widget
- Optionally show "Be first to review" for new items

## Expected Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reviews | List reviews (type + itemId) |
| POST | /api/reviews | Submit new review |
| PUT | /api/reviews/:id/helpful | Mark review helpful |

## Dependencies
- Manager Reviews API (existing) - For moderation
- Frontend reviews-service.js - Already calls these endpoints

## Testing curl Examples
```bash
# Get reviews for a hotel
curl -X GET "http://localhost:3000/api/reviews?type=hotels&itemId=h123"

# Get reviews for a tour
curl -X GET "http://localhost:3000/api/reviews?type=tours&itemId=samburu"

# Submit a review
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"type":"hotels","itemId":"h123","rating":5,"text":"Great!","user":"John"}'

# Mark review helpful
curl -X PUT http://localhost:3000/api/reviews/r1/helpful
```

## Done ✅
- [x] Documented public reviews API in FRONTEND_INTEGRATION.md

## Next Steps
- [ ] Implement backend reviews model/table
- [ ] Implement GET /api/reviews endpoint
- [ ] Implement POST /api/reviews endpoint
- [ ] Implement PUT /api/reviews/:id/helpful endpoint
- [ ] Test with frontend