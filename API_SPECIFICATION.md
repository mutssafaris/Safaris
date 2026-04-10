# Muts Safaris API Specification

## Overview

This document outlines the complete API expectations for the Muts Safaris website. The frontend is designed to work with either mock data (current) or a real backend API. All endpoints follow RESTful conventions.

---

## Base Configuration

### Environment URLs

| Environment | API Base URL | WebSocket URL |
|-------------|--------------|---------------|
| Development | `http://localhost:3000/api` | `ws://localhost:3000` |
| Staging | `https://staging-api.mutssafaris.com/api` | `wss://staging-api.mutssafaris.com` |
| Production | `https://api.mutssafaris.com/api` | `wss://api.mutssafaris.com` |

### API Configuration

The frontend uses `MutsAPIConfig` as a centralized configuration:

```javascript
// Get current environment
MutsAPIConfig.getEnvironment()          // 'development' | 'staging' | 'production'

// Get base URL
MutsAPIConfig.getBaseURL()              // Full API base URL

// Get endpoints
MutsAPIConfig.getEndpoints()           // Returns all service endpoints

// Enable/disable API
MutsAPIConfig.enableAllAPIs()           // Switch all services to API mode
MutsAPIConfig.disableAllAPIs()          // Revert to mock data
MutsAPIConfig.configure({ enableAll: true, environment: 'production' })
```

---

## Services & Endpoints

### 1. Hotels Service

**Service Variable:** `window.MutsHotelsService`

**Base Endpoint:** `/api/hotels`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hotels` | Get all hotels |
| GET | `/api/hotels/:id` | Get hotel by ID |
| GET | `/api/hotels?filter=tier:luxury` | Filter by tier (luxury, mid-range, eco-budget) |
| GET | `/api/hotels?filter=location:mara` | Filter by location |
| GET | `/api/hotels?search=maasai` | Search hotels |
| POST | `/api/hotels/:id/reviews` | Add review to hotel |

**Hotel Object Schema:**

```javascript
{
    id: string,           // Unique identifier (e.g., 'h1')
    name: string,         // Hotel name
    badge: string,        // Display badge (e.g., 'Luxury')
    tier: string,         // 'luxury' | 'mid-range' | 'eco-budget'
    location: string,     // Location slug (e.g., 'mara', 'amboseli')
    locationName: string, // Human-readable location
    description: string, // Hotel description
    price: number,        // Price per night
    rating: number,       // Rating (0-5)
    reviews: number,      // Number of reviews
    image: string,        // Image URL path
    imageLoaded: boolean, // Image load state
    amenities: [
        { icon: string, name: string }
    ],
    rooms: number,        // Number of rooms
    link: string          // Detail page link
}
```

---

### 2. Bookings Service

**Service Variable:** `window.MutsBookingsService`

**Base Endpoint:** `/api/bookings`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get all bookings (with optional userId) |
| GET | `/api/bookings?limit=5` | Get recent bookings |
| GET | `/api/bookings/:id` | Get booking by ID |
| POST | `/api/bookings` | Create new booking |
| PUT | `/api/bookings/:id` | Update booking |
| PATCH | `/api/bookings/:id/status` | Update booking status |

**Query Parameters:**
- `userId` - Filter by user
- `limit` - Limit results
- `status` - Filter by status

**Booking Object Schema:**

```javascript
{
    id: string,           // Unique booking ID
    userId: string,       // Associated user ID
    destination: string,  // Trip destination
    checkin: string,      // Check-in date (YYYY-MM-DD)
    checkout: string,     // Check-out date (YYYY-MM-DD)
    adults: number,       // Number of adults
    children: number,     // Number of children
    infants: number,      // Number of infants
    totalPrice: number,   // Total price
    status: string,       // 'upcoming' | 'completed' | 'cancelled' | 'cancellation_pending'
    createdAt: string     // Creation timestamp
}
```

---

### 3. Messages Service

**Service Variable:** `window.MutsMessagesService`

**Base Endpoint:** `/api/messages`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages` | Get all conversations |
| GET | `/api/messages?type=support` | Filter by type |
| GET | `/api/messages/:id` | Get conversation details |
| POST | `/api/messages/:id` | Send message |
| POST | `/api/messages/:id/read` | Mark as read |

**Query Parameters:**
- `type` - Filter by type ('support', 'direct', 'notification')

**Conversation Object Schema:**

```javascript
{
    id: string,
    type: string,         // 'support' | 'direct' | 'notification'
    participants: [
        { name: string, avatar: string, role: string }
    ],
    lastMessage: string,
    timestamp: string,   // ISO 8601
    unreadCount: number,
    messages: [
        { id: string, sender: string, text: string, time: string }
    ]
}
```

---

### 4. Transactions Service

**Service Variable:** `window.MutsTransactionsService`

**Base Endpoint:** `/api/transactions`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/summary` | Get spending summary |
| GET | `/api/transactions/:id` | Get transaction by ID |

**Summary Response:**

```javascript
{
    total: number,        // Total spending
    pending: number,     // Pending amount
    completed: number    // Completed amount
}
```

**Transaction Object Schema:**

```javascript
{
    id: string,          // Transaction ID (e.g., 'TXN-77421')
    date: string,        // ISO 8601 timestamp
    description: string,
    category: string,   // 'Safari' | 'Marketplace' | 'Hotel'
    type: string,        // 'Debit' | 'Credit'
    amount: number,
    status: string,     // 'completed' | 'pending' | 'failed'
    method: string      // Payment method
}
```

---

### 5. Destinations Service

**Service Variable:** `window.MutsDestinationsService`

**Base Endpoint:** `/api/destinations`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/destinations` | Get all destinations |
| GET | `/api/destinations?popular=true` | Get popular destinations |
| GET | `/api/destinations/:id` | Get destination by ID |
| GET | `/api/destinations?type=safari` | Filter by type |
| GET | `/api/destinations?search=maasai` | Search destinations |

**Query Parameters:**
- `type` - Filter ('safari', 'beach', 'adventure')
- `popular` - Get popular destinations
- `search` - Search by name

**Destination Object Schema:**

```javascript
{
    id: string,
    name: string,
    region: string,
    description: string,
    duration: string,    // Display string (e.g., '3-7 Days')
    priceFrom: number,  // Starting price
    rating: number,
    image: string,
    tags: string[],     // e.g., ['Most Popular', 'Big Five']
    type: string,       // 'safari' | 'beach' | 'adventure'
    link: string
}
```

---

### 6. Listings Service

**Service Variable:** `window.MutsListingsService`

**Base Endpoint:** `/api/listings`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/listings/:category` | Get listings by category |
| GET | `/api/listings/:category/:id` | Get listing detail |
| GET | `/api/listings/beaches?name=...` | Get beach by name |
| GET | `/api/listings/packages?name=...` | Get package by name |
| GET | `/api/listings` | Get all listings |

**Categories:** `tours`, `packages`, `beaches`, `hotels`, `experiences`

**Tour Object Schema:**

```javascript
{
    id: string,
    name: string,
    badge: string,
    description: string,
    duration: string,
    image: string,
    link: string
}
```

**Package Object Schema:**

```javascript
{
    id: string,
    name: string,
    badge: string,
    description: string,
    image: string,
    link: string,
    hero: string,
    duration: string,
    overview: string,
    highlights: [
        { title: string, desc: string }
    ],
    includes: string[]
}
```

**Beach Object Schema:**

```javascript
{
    id: string,
    name: string,
    badge: string,
    description: string,
    duration: string,
    image: string,
    link: string,
    hero: string,
    overview: string,
    highlights: [...],
    activities: string[],
    bestTime: string
}
```

---

### 7. Africasa Service (Marketplace)

**Service Variable:** `window.MutsAfricasaService`

**Base Endpoint:** `/api/africasa`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/africasa` | Get all products |
| GET | `/api/africasa?category=jewelry` | Filter by category |
| GET | `/api/africasa/:id` | Get product by ID |
| GET | `/api/africasa?search=...` | Search products |
| GET | `/api/africasa?featured=true` | Get featured products |
| GET | `/api/africasa?ids=id1,id2` | Get multiple by IDs |

**Categories:** `jewelry`, `art`, `textiles`, `pottery`, `accessories`

**Product Object Schema:**

```javascript
{
    id: string,
    name: string,
    description: string,
    price: number,
    originalPrice: number,
    category: string,
    images: string[],
    details: {
        material: string,
        origin: string,
        artisan: string,
        size: string // or dimensions
    },
    stock: number,
    rating: number,
    reviews: number,
    featured: boolean
}
```

---

### 8. Reviews Component

**Service Variable:** `window.MutsHotelReviews`

The reviews are handled within the Hotels service but exposed via a component:

```javascript
MutsHotelReviews.init({
    hotelId: 'h1',
    containerId: 'reviews',
    hotelService: window.MutsHotelsService
});

// Available methods
MutsHotelReviews.toggleForm()   // Toggle review form visibility
MutsHotelReviews.setRating(n)   // Set star rating
MutsHotelReviews.submitReview()  // Submit review
```

---

## Authentication

The frontend uses `window.MutsAuth` for user authentication:

```javascript
// Check if logged in
MutsAuth.isLoggedIn()

// Get current user
MutsAuth.getCurrentUser()
// Returns: { name: string, email: string, tier: string, ... }

// Login
MutsAuth.login(email, password)

// Logout
MutsAuth.logout()
```

**API Authentication Notes:**
- All authenticated endpoints should require a valid JWT token
- Token should be passed via `Authorization: Bearer <token>` header
- Token refresh endpoint required at `/api/auth/refresh`

---

## Error Handling

All services handle errors gracefully by falling back to mock data:

```javascript
fetchFromAPI: function(endpoint) {
    var baseURL = MutsAPIConfig.getBaseURL();
    var timeout = MutsAPIConfig.getTimeout();
    
    var fetchPromise = fetch(baseURL + endpoint).then(response => {
        if (!response.ok) throw new Error('API error');
        return response.json();
    }).catch(err => {
        console.warn('[ServiceName] API unavailable, using mock data');
        return mockData;
    });
    
    var timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeout));
    
    return Promise.race([fetchPromise, timeoutPromise]).catch(() => mockData);
}
```

---

## Response Format

All API responses should follow this structure:

**Success:**
```javascript
{
    success: true,
    data: { ... },
    message: "Optional message"
}
```

**Error:**
```javascript
{
    success: false,
    error: "Error message",
    code: "ERROR_CODE"
}
```

---

## WebSocket (Future)

The configuration supports WebSocket for real-time features:

```javascript
// Get WebSocket URL
MutsAPIConfig.getWSBaseURL()

// Potential use cases:
// - Real-time chat updates
// - Live booking status
// - Push notifications
```

---

## Testing Checklist

When implementing the backend, verify:

- [ ] All endpoints return valid JSON
- [ ] Proper HTTP status codes (200, 201, 400, 404, 500)
- [ ] CORS enabled for all origins
- [ ] Request timeout handled (15-30 seconds)
- [ ] Error responses are consistent
- [ ] Pagination works for list endpoints
- [ ] Filtering and search work correctly
- [ ] Authentication flow works end-to-end

---

## Frontend Integration

To switch from mock data to real API:

```javascript
// Option 1: Enable all services
MutsAPIConfig.configure({ enableAll: true });

// Option 2: Enable specific services
MutsAPIConfig.configure({
    enableServices: ['hotels', 'bookings']
});

// Option 3: Set environment and enable
MutsAPIConfig.configure({
    environment: 'production',
    enableAll: true
});
```

---

## Contact & Support

For API-related questions:
- Email: api-support@mutssafaris.com
- Documentation: https://docs.mutssafaris.com

---

*Document Version: 1.0*
*Last Updated: 2026-04-03*
*Frontend Version: Compatible with current Muts Safaris codebase*