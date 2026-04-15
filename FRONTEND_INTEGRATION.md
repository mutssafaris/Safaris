# Frontend Integration Notes

This file tracks API integration requirements for the Muts Safaris frontend dashboard.

---

## Dashboard Page - API Requirements

### Current Status: Services with Mock Fallback

The dashboard uses service layer pattern with automatic fallback to mock JSON data when API unavailable.

| Feature | Service | Endpoint Expected | Status |
|---------|---------|-------------------|--------|
| Destinations | MutsDestinationsService | GET /api/destinations | ✅ Mock ready |
| Hotels | MutsHotelsService | GET /api/hotels, /api/hotels/{id}, /api/hotels?tier=...&location=... | ✅ Mock ready |
| Bookings | MutsBookingsService | GET /api/bookings | ✅ Mock ready |
| Messages | MutsMessagesService | GET /api/messages | ✅ Mock ready |
| Transactions | MutsTransactionsService | GET /api/transactions, /api/transactions/{id}, /api/transactions/summary | ✅ Mock ready (data/transactions.json) |
| Notifications | MutsNotificationsService | GET /api/notifications | ✅ Mock ready |
| Localization | MutsI18n | GET /api/localization/strings | ✅ Fallback ready |

---

## API Endpoints Required by Dashboard

### 1. Destinations
```
GET /api/destinations
GET /api/destinations/{id}
GET /api/destinations?type=safari|beach
GET /api/destinations?popular=true
```

### 2. Hotels
```
GET /api/hotels
GET /api/hotels/{id}
GET /api/hotels?tier=luxury|mid-range|eco-budget
GET /api/hotels?location=mara|amboseli|coast|nairobi
GET /api/hotels?search=maasai
```

**Response Schemas:**

```javascript
// GET /api/hotels
{
  "success": true,
  "data": [
    {
      "id": "h1",
      "name": "Governors' Camp",
      "badge": "Luxury",
      "tier": "luxury",
      "location": "mara",
      "locationName": "Maasai Mara",
      "description": "Luxury tented camp...",
      "price": 450,
      "rating": 4.9,
      "reviews": 234,
      "image": "../../images/hotels/governors-camp.jpg",
      "amenities": [
        { "icon": "📶", "name": "WiFi" },
        { "icon": "🏊", "name": "Pool" }
      ],
      "rooms": 25
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20
}

// GET /api/hotels/{id}
{
  "success": true,
  "data": {
    "id": "h1",
    "name": "Governors' Camp",
    "tier": "luxury",
    "location": "mara",
    "locationName": "Maasai Mara",
    "description": "Full description...",
    "price": 450,
    "rating": 4.9,
    "reviews": 234,
    "images": ["...", "..."],
    "amenities": [...],
    "rooms": 25,
    "roomTypes": [
      { "type": "Tent", "price": 450, "available": 10 },
      { "type": "Suite", "price": 650, "available": 5 }
    ],
    "contact": { "phone": "...", "email": "..." },
    "policies": { "checkIn": "12:00", "checkOut": "10:00" }
  }
}
```

**Query Parameters:**
- `tier` - Filter by: luxury, mid-range, eco-budget
- `location` - Filter by: mara, amboseli, coast, nairobi
- `search` - Search by hotel name
- `minPrice` / `maxPrice` - Price range filter
- `rating` - Minimum rating filter
- `limit` / `offset` - Pagination

### 3. Bookings (My Trips)
```
GET /api/bookings
GET /api/bookings?userId={id}
GET /api/bookings?status=upcoming|completed|cancelled
GET /api/bookings/{id}
POST /api/bookings
PUT /api/bookings/{id}
DELETE /api/bookings/{id}
PUT /api/bookings/{id}/status
```

**Booking Fields Required:**
```json
{
  "id": "string",
  "userId": "string",
  "destination": "string (display name)",
  "hotelId": "string (optional)",
  "productType": "tour|hotel|package|beach",
  "checkin": "YYYY-MM-DD",
  "checkout": "YYYY-MM-DD",
  "adults": "number",
  "children": "number",
  "infants": "number (optional)",
  "totalPrice": "number",
  "status": "upcoming|pending|cancellation_pending|completed|cancelled",
  "paymentStatus": "pending|paid|refunded",
  "createdAt": "ISO date",
  "reservedAt": "ISO date (optional)",
  "expiresAt": "ISO date (optional - 15-min hold)"
}
```

### 4. User/Auth
```
POST /api/auth/login
POST /api/auth/register
GET /api/auth/me
PUT /api/auth/profile
PUT /api/auth/password
```

**Response Schemas:**

```javascript
// GET /api/auth/me
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+254712345678",
    "country": "KE",
    "tier": "explorer",
    "avatar": null,
    "createdAt": "2025-01-15T10:30:00Z"
  }
}

// PUT /api/auth/profile
{
  "success": true,
  "data": {
    "name": "John Doe",
    "phone": "+254712345678",
    "country": "KE"
  },
  "message": "Profile updated successfully"
}
```

### 5. Notifications
```
GET /api/notifications
GET /api/notifications/unread-count
PUT /api/notifications/{id}/read
```

### 6. Messages/Conversations
```
GET /api/conversations
GET /api/conversations/{id}
POST /api/conversations/{id}/messages
```

### 7. Transactions
```
GET /api/transactions
GET /api/transactions/{id}
GET /api/transactions/summary
```

**Response Schemas:**

```javascript
// GET /api/transactions
{
  "success": true,
  "data": [
    {
      "id": "TXN-77421",
      "date": "2026-04-14T14:30:00Z",
      "description": "Maasai Mara 5-Day Expedition Deposit",
      "category": "Safari",
      "type": "Debit",
      "amount": 1200.00,
      "status": "completed",
      "method": "Visa •••• 4242"
    }
  ],
  "message": "Transactions retrieved successfully"
}

// GET /api/transactions/summary
{
  "success": true,
  "data": {
    "total": 12435.50,
    "pending": 2650.00,
    "completed": 9785.50,
    "failed": 450.00
  },
  "message": "Summary retrieved successfully"
}

// GET /api/transactions/{id}
{
  "success": true,
  "data": {
    "id": "TXN-77421",
    "date": "2026-04-14T14:30:00Z",
    "description": "Maasai Mara 5-Day Expedition Deposit",
    "category": "Safari",
    "type": "Debit",
    "amount": 1200.00,
    "status": "completed",
    "method": "Visa •••• 4242"
  },
  "message": "Transaction retrieved successfully"
}
```

**Query Parameters (GET /api/transactions):**
- `status` - Filter by status: completed, pending, failed
- `category` - Filter by category: Safari, Hotel, Marketplace, Package
- `fromDate` - Filter from date (ISO 8601)
- `toDate` - Filter to date (ISO 8601)
- `limit` - Limit number of results
- `offset` - Pagination offset

### 8. Localization
```
GET /api/localization/strings?lang=en
```

---

## My Trips Page Implementation

### Frontend Features
- Filter by: All, Upcoming, Completed, Cancelled
- Loading state with spinner
- Error state with retry button
- Empty state when no trips
- API fallback to local storage/mock data

### API Requirements for My Trips

**Endpoint:** `GET /api/bookings`

**Query Parameters:**
- `userId` - Filter by user (required for authenticated user)
- `status` - Filter by status: upcoming, completed, cancelled
- `fromDate` - Filter trips from date
- `toDate` - Filter trips to date

**Response:** Returns array of booking objects

**Fallback Behavior:**
1. If API fails, use localStorage 'muts_bookings' cache
2. If no cached data, use mockBookings in service
3. Show appropriate UI state (loading/error/empty)

---

## Features Missing in API (per safarisApi FRONTEND_INTEGRATION.md)

1. **HotelInventory (Phase 3.5)** - Not implemented
   - No per-date room availability
   - Cannot show "Only X rooms left"

2. **Payment Webhook** - Partially implemented
   - Flutterwave integration exists but may need testing

---

## Frontend Service Configuration

**API Base URL:** `http://localhost:3000/api`

**How to enable API mode:**
```javascript
MutsBookingsService.enableAPI('http://localhost:3000/api');
```

**Current Behavior:**
- Services check `_apiReady` flag
- If true, attempts API calls
- On failure, automatically falls back to localStorage cache or mock data
- Error handling with console warnings (non-blocking)

---

## Travel Information Page - API Requirements

### Current Status: Static Content
Travel info pages (visas, vaccinations, safety, weather) are currently static HTML with no API integration.

### API Endpoints Needed

#### 1. Travel Info Content (NEW - needs implementation)
```
GET /api/travel-info/visas
GET /api/travel-info/vaccinations
GET /api/travel-info/safety
GET /api/travel-info/weather
GET /api/travel-info/quick-facts
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "title": "Visas & Entry",
    "content": "Full HTML content...",
    "sections": [
      { "heading": "Visa Types", "content": "..." },
      { "heading": "e-Visa Application", "content": "..." }
    ],
    "lastUpdated": "2026-04-15"
  }
}
```

#### 2. Blog Posts (needed for /blog)
```
GET /api/blog/posts
GET /api/blog/posts/{slug}
GET /api/blog/categories
```

#### 3. FAQ (needed for /faq)
```
GET /api/faq
GET /api/faq/{category}
```

---

## Manager Dashboard - Missing Endpoints

### Current Manager Endpoints (verified in API)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/manager/auth/login | Manager login |
| POST | /api/manager/auth/register | Register manager |
| POST | /api/manager/auth/refresh | Refresh token |
| GET | /api/manager/content/hotels | List hotels |
| POST | /api/manager/content/hotels | Create hotel |
| PUT | /api/manager/content/hotels/{id} | Update hotel |
| DELETE | /api/manager/content/hotels/{id} | Delete hotel |
| POST | /api/manager/content/hotels/{id}/publish | Publish hotel |
| POST | /api/manager/content/hotels/{id}/unpublish | Unpublish hotel |
| POST | /api/manager/content/hotels/{id}/duplicate | Duplicate hotel |
| GET | /api/manager/content/destinations | List destinations |
| POST | /api/manager/content/destinations | Create destination |
| PUT | /api/manager/content/destinations/{id} | Update destination |
| DELETE | /api/manager/content/destinations/{id} | Delete destination |
| POST | /api/manager/content/destinations/{id}/publish | Publish destination |
| POST | /api/manager/content/destinations/{id}/duplicate | Duplicate destination |
| GET | /api/manager/content/products | List products |
| POST | /api/manager/content/products | Create product |
| PUT | /api/manager/content/products/{id} | Update product |
| DELETE | /api/manager/content/products/{id} | Delete product |
| POST | /api/manager/content/products/{id}/publish | Publish product |
| POST | /api/manager/content/products/{id}/duplicate | Duplicate product |
| GET | /api/manager/images/upload | Image upload exists |

### Missing Manager Endpoints (to be added to API)

| Method | Endpoint | Description | Priority |
|--------|----------|-------------|----------|
| GET | /api/manager/transactions | List all transactions | HIGH |
| GET | /api/manager/transactions/{id} | Get transaction details | HIGH |
| GET | /api/manager/transactions/summary | Get revenue summary | HIGH |
| POST | /api/manager/transactions/export | Export transactions | MEDIUM |
| GET/POST | /api/manager/content/blog | Blog CRUD | HIGH |
| GET/POST | /api/manager/content/faq | FAQ CRUD | HIGH |

---

## Manager Hotels API

**Base Endpoint:** `/api/manager/content/hotels`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/content/hotels` | List all hotels |
| GET | `?tier=luxury` | Filter by tier |
| GET | `?status=published` | Filter by status |
| GET | `?search=maasai` | Search hotels |
| GET | `/api/manager/content/hotels/{id}` | Get hotel details |
| POST | `/api/manager/content/hotels` | Create hotel |
| PUT | `/api/manager/content/hotels/{id}` | Update hotel |
| DELETE | `/api/manager/content/hotels/{id}` | Delete hotel |
| POST | `/api/manager/content/hotels/{id}/publish` | Publish hotel |
| POST | `/api/manager/content/hotels/{id}/unpublish` | Unpublish hotel |
| POST | `/api/manager/content/hotels/{id}/duplicate` | Duplicate hotel |

**Request/Response Schemas:**

```javascript
// POST /api/manager/content/hotels
{
  "name": "Governors' Camp",
  "tier": "luxury",
  "location": "mara",
  "locationName": "Maasai Mara",
  "description": "Luxury tented camp...",
  "price": 450,
  "rating": 4.9,
  "images": ["..."],
  "amenities": ["WiFi", "Pool", "Spa"],
  "rooms": 25,
  "roomTypes": [
    { "type": "Tent", "price": 450, "available": 10 },
    { "type": "Suite", "price": 650, "available": 5 }
  ],
  "contact": { "phone": "...", "email": "..." },
  "policies": { "checkIn": "12:00", "checkOut": "10:00" }
}

// GET /api/manager/content/hotels
{
  "success": true,
  "data": {
    "hotels": [...],
    "total": 15,
    "page": 1,
    "limit": 20
  }
}
```

---

## Manager Transactions API

**Base Endpoint:** `/api/manager/transactions`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/transactions` | Get all transactions |
| GET | `/api/manager/transactions?status=completed` | Filter by status |
| GET | `?category=Safari` | Filter by category |
| GET | `?search=maasai` | Search transactions |
| GET | `?dateFrom=2026-01-01&dateTo=2026-04-15` | Filter by date range |
| GET | `/api/manager/transactions/{id}` | Get single transaction |
| GET | `/api/manager/transactions/summary` | Get revenue summary |
| POST | `/api/manager/transactions/export?format=csv` | Export transactions |

**Response Schemas:**

```javascript
// GET /api/manager/transactions
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "TXN-77421",
        "date": "2026-04-14",
        "description": "Maasai Mara 5-Day Expedition",
        "category": "Safari",
        "type": "Debit",
        "amount": 2100.00,
        "status": "completed",
        "method": "Visa •••• 4242",
        "customer": "John Smith",
        "customerEmail": "john@example.com"
      }
    ],
    "total": 45,
    "page": 1,
    "limit": 20
  }
}

// GET /api/manager/transactions/summary
{
  "success": true,
  "data": {
    "totalRevenue": 45200.00,
    "completed": 38450.00,
    "pending": 6750.00,
    "failed": 450.00,
    "totalTransactions": 42
  }
}

// GET /api/manager/transactions/{id}
{
  "success": true,
  "data": {
    "id": "TXN-77421",
    "date": "2026-04-14T14:30:00Z",
    "description": "Maasai Mara 5-Day Expedition",
    "category": "Safari",
    "type": "Debit",
    "amount": 2100.00,
    "status": "completed",
    "method": "Visa •••• 4242",
    "customer": "John Smith",
    "customerEmail": "john@example.com",
    "customerPhone": "+254700000001",
    "bookingId": "BK-77421"
  }
}
```
| GET/POST | /api/manager/content/pages | Static pages (about, contact) | HIGH |
| GET/POST | /api/manager/content/travel-info | Travel info content | MEDIUM |
| POST | /api/manager/images/upload/bulk | Bulk image upload | MEDIUM |
| GET | /api/manager/analytics/bookings | Booking analytics | MEDIUM |
| GET | /api/manager/analytics/revenue | Revenue reports | MEDIUM |
| GET/POST | /api/manager/users | User management | LOW |

---

## Manager User Management API

**Base Endpoint:** `/api/manager/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/users` | Get all users |
| GET | `?tier=explorer` | Filter by tier |
| GET | `?status=active` | Filter by status |
| GET | `?search=john` | Search users |
| GET | `/api/manager/users/{id}` | Get user details |
| PUT | `/api/manager/users/{id}` | Update user |
| PUT | `/api/manager/users/{id}/tier` | Update user tier |
| PUT | `/api/manager/users/{id}/status` | Activate/deactivate user |
| POST | `/api/manager/users/{id}/message` | Send message to user |

**Response Schemas:**

```javascript
// GET /api/manager/users
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "name": "John Smith",
        "email": "john@example.com",
        "phone": "+254700000001",
        "tier": "explorer",
        "bookings": 5,
        "totalSpent": 4250.00,
        "joined": "2025-06-15",
        "status": "active",
        "lastTrip": "2026-03-20"
      }
    ],
    "total": 45,
    "page": 1,
    "limit": 20
  }
}
```

### API Implementation Suggestions

**1. Blog Management:**
```kotlin
// POST /api/manager/content/blog
data class BlogPostRequest(
    val title: String,
    val slug: String,
    val content: String,
    val excerpt: String,
    val category: String,
    val tags: List<String>,
    val imageUrl: String,
    val author: String,
    val published: Boolean = false,
    val publishedAt: String? = null
)
```

**2. FAQ Management:**
```kotlin
// POST /api/manager/content/faq
data class FAQRequest(
    val question: String,
    val answer: String,
    val category: String,
    val order: Int = 0
)
```

**3. Travel Info Content:**
```kotlin
// POST /api/manager/content/travel-info
data class TravelInfoRequest(
    val type: String, // "visas", "vaccinations", "safety", "weather"
    val title: String,
    val content: String, // HTML content
    val sections: List<Section>
)

data class Section(
    val heading: String,
    val content: String
)
```

---

## Error Handling Patterns

### Service-Level Fallback Pattern
```javascript
if (_apiReady) {
    return this.fetchFromAPI('/endpoint')
        .catch(function() {
            // Fallback to local data
            return Promise.resolve(localData);
        });
}
return Promise.resolve(mockData);
```

### UI States Required
1. **Loading** - Show spinner while fetching
2. **Success** - Render data normally
3. **Error** - Show error message with retry button
4. **Empty** - Show "no data" message with action link
5. **Offline** - Use cached data with "showing cached" indicator

---

## Notes

- All services automatically fall back to mock data if API unavailable
- Manager dashboard requires JWT token in Authorization header
- JWT expires after 24 hours
- Public endpoints accessible without auth
- Role-based access control enforced server-side
- LocalStorage used for caching user-specific data

---

*Last Updated: 2026-04-15*