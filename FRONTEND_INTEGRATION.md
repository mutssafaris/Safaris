# Frontend Integration Notes

This file tracks changes and differences between the API implementation and the API_SPECIFICATION.md that the frontend needs to accommodate. Update this file whenever there are backend changes that affect frontend integration.

---

## API Status Summary

| Phase | Feature | Status | Notes |
|-------|---------|--------|-------|
| 0 | Foundation | ✅ Complete | Test config, published field, role field |
| 1 | Public APIs + Publishing | ✅ Complete | Published flag on entities |
| 2 | Authentication | ✅ Complete | JWT, BCrypt, role-based |
| 3 | Manager Dashboard | ✅ Complete | Full CRUD |
| 3.5 | Availability Management | ✅ Complete | HotelInventory entity + backend endpoints implemented |
| 4 | Bookings & Payments | ✅ Complete | Payment entity, webhooks, M-Pesa/Stripe |
| 4.5 | Booking Inventory Lock | ✅ Complete | 15-min reservation hold backend + frontend |
| 5 | Messaging | ✅ Complete | Conversation, messages |
| 6 | Analytics | ✅ Complete | Revenue, bookings reports |
| 7 | Caching & Performance | ✅ Complete | Redis caching + rate limiting |
| 8 | Testing & DevOps | ✅ Complete | Swagger, Dockerfile, CI/CD |
| - | Image Upload | ✅ Complete | File upload endpoint added |
| - | Favorites API | ✅ Complete | Favorite entity, endpoints, frontend integrated |
| - | Content Duplicate | ✅ Complete | Duplicate endpoints for hotels, destinations, products |

---

## Backend Implemented Features

### Phase 3.5: Availability Management ✅ COMPLETED

**Backend Entity:**
- `HotelInventory` entity in `model/entity/HotelInventory.kt`
- Repository: `HotelInventoryRepository`
- Service: `HotelInventoryService`
- Controller: `/api/manager/inventory`

**Endpoints implemented:**
- `GET /api/manager/inventory/{hotelId}` - View availability calendar
- `GET /api/manager/inventory/{hotelId}/availability` - Get availability summary
- `GET /api/manager/inventory/{hotelId}/available-dates` - Get available dates
- `GET /api/manager/inventory/{hotelId}/check?date=YYYY-MM-DD` - Check specific date
- `POST /api/manager/inventory/{hotelId}/init` - Initialize inventory for date range
- `POST /api/manager/inventory/{hotelId}/block` - Block rooms
- `POST /api/manager/inventory/{hotelId}/unblock` - Unblock rooms

### Phase 4.5: Booking Inventory Lock ✅ COMPLETED

**Backend:**
- `Booking` entity has `reservedAt` / `expiresAt` fields
- `BookingService` has `initiateReservation()` and `releaseReservation()` methods
- `ReservationScheduler` runs every 60s to release expired holds

**Frontend:**
- `js/reservation-timer.js` - Reusable countdown component
- `js/services/bookings-service.js` - Added `checkReservationHold`, `initiateReservation`, `releaseReservation`, `checkAvailability` methods

### Favorites API ✅ COMPLETED

**Backend:**
- Entity: `Favorite` in `model/entity/Favorite.kt`
- Repository: `FavoriteRepository`
- Service: `FavoriteService`
- Controller: `/api/favorites`

**Endpoints:**
- `GET /api/favorites` - Get user's favorites
- `GET /api/favorites/{itemType}` - Get favorites by type
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/{itemType}/{itemId}` - Remove from favorites

**Frontend:**
- `js/favorites.js` - Updated to sync with API

### Content Duplicate ✅ COMPLETED

**Endpoints:**
- `POST /api/manager/content/hotels/{id}/duplicate` - Duplicate hotel
- `POST /api/manager/content/destinations/{id}/duplicate` - Duplicate destination
- `POST /api/manager/content/products/{id}/duplicate` - Duplicate product

---

## Verified Endpoints (Working)

### 1. Authentication - Role-Based Users (NEW in Phase 2)

The backend now uses **role-based authentication** with JWT tokens. This differs from the basic session auth mentioned in the spec.

**User Roles:**
- `ADMIN` - Full system access
- `MANAGER` - Content and booking management
- `GUIDE` - Limited booking/access
- `USER` - Public user access

**Implementation:**

```javascript
// Login request
POST /api/manager/auth/login
Body: { email: string, password: string }

// Login response (differs from spec)
{
    success: true,
    data: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // JWT token
        user: {
            id: 1,
            name: "John Manager",
            email: "manager@mutssafaris.com",
            role: "MANAGER"  // Role enum value
        }
    }
}
```

**Frontend changes needed:**
- Store JWT token (not session object) in `localStorage` with key `muts_manager_session`
- Token should be sent in `Authorization` header: `Authorization: Bearer <token>`
- Role is included in response - use for permission checks

```javascript
// Store token after login
localStorage.setItem('muts_manager_session', JSON.stringify(response.data.token));

// Include in API requests
const token = JSON.parse(localStorage.getItem('muts_manager_session'));
fetch('/api/manager/content/hotels', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
```

**Registration:**
```javascript
// Register new manager
POST /api/manager/auth/register
Body: {
    name: "New Manager",
    email: "new@mutssafaris.com",
    password: "securepassword",
    role: "MANAGER"  // Optional, defaults to MANAGER
}
```

---

## Verified Endpoints (Working)

These endpoints match the spec and work correctly:

| Method | Endpoint | Status |
|--------|-----------|--------|
| POST | `/api/manager/auth/login` | ✅ Working |
| POST | `/api/manager/auth/register` | ✅ Working |
| GET | `/api/manager/content/hotels` | ✅ Working |
| POST | `/api/manager/content/hotels` | ✅ Working |
| GET | `/api/manager/content/destinations` | ✅ Working |
| POST | `/api/manager/content/destinations` | ✅ Working |

---

## Availability Management (PENDING - Phase 3.5)

**Critical feature** - Track room inventory per date.

**Backend Entity:**
```kotlin
data class HotelInventory(
    hotelId: String,
    date: LocalDate,
    totalRooms: Int,        // 20 rooms
    bookedRooms: Int,        // 17 booked
    availableRooms: Int     // 3 remaining
)
```

**Manager Endpoints (needed):**
- GET /api/manager/inventory/{hotelId} - View availability calendar
- PUT /api/manager/inventory/{hotelId} - Update room count
- POST /api/manager/inventory/{hotelId}/block - Block/unblock dates

**Customer Frontend (needed):**
- Show "Only X rooms left!" warning when available < 5
- Gray out sold-out dates on calendar
- Show "Sold Out" instead of booking button
- Block checkout when inventory = 0
- **Graceful acceptance:** Check inventory on ADD TO CART → Re-check on CHECKOUT → Block if sold out (refund + show error)
- **Race condition handling:** If inventory=0 between add-to-cart and checkout, show "Sorry - booked by another customer" + offer alternative dates
- **Auto-refresh:** Refresh availability after booking completion or timeout (15 min)

---

## Booking Inventory Lock ✅ DONE (Phase 4.5)

**Implemented:** 15-minute reservation hold during payment.

**Backend:**
- Booking entity has `reservedAt` / `expiresAt` fields
- Payment initiates reservation on `POST /api/payments/initiate`
- Webhook releases on success; auto-expires after 15 min
- Scheduled job runs every 60s to release expired holds

**Customer Flow:**
1. User clicks "Book Now" → Creates booking (pending)
2. Clicks "Pay" → Payment initiates → reservation starts (15 min hold)
3. If customer completes → Booking CONFIRMED
4. If 15 min passes → Hold released → Available to other customer

**Frontend (needed):**
- Show `isReserved: true` in booking response → "Someone is booking..." warning
- Show reservation countdown if user started payment but didn't complete
- On return to checkout, check if `isReserved` still valid

**Not yet implemented** - needed to prevent double-bookings:
- Backend: Reserve slot when payment initiated (15min hold)
- Backend: Release after 15min if not paid
- Backend: Reject second customer if slot already RESERVED
- Backend: Scheduled job to auto-cancel expired reservations

**Frontend changes needed:**
- Show countdown timer for 15min hold
- Show "Slot reserved by another customer" error if unavailable
- Auto-refresh availability after timeout

---

## Notes

- JWT tokens expire after 24 hours
- All manager endpoints require valid JWT in Authorization header
- Role-based access control is enforced server-side
- Public APIs (hotels, destinations, bookings) accessible without JWT
- Payment webhook endpoint public for Flutterwave callbacks

### Implementation Complete

The following frontend updates have been implemented:

1. **Manager Authentication** - JWT token handling with proper session storage
2. **Manager Registration** - New register method available
3. **Reservation Timer** - 15-minute hold countdown component
4. **Booking Hold Methods** - API methods for reservation management

---

*Last Updated: 2026-04-12*
*Frontend updated to support JWT auth and reservation holds*