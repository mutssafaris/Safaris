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

<<<<<<< HEAD
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

=======
---

## Public API Services

### 1. Hotels Service

>>>>>>> ab0edb5 (added few features)
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
<<<<<<< HEAD

=======
>>>>>>> ab0edb5 (added few features)
```javascript
{
    id: string,           // Unique identifier (e.g., 'h1')
    name: string,         // Hotel name
    badge: string,        // Display badge (e.g., 'Luxury')
    tier: string,         // 'luxury' | 'mid-range' | 'eco-budget'
    location: string,     // Location slug (e.g., 'mara', 'amboseli')
    locationName: string, // Human-readable location
<<<<<<< HEAD
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
=======
    description: string,  // Hotel description
    price: number,        // Price per night
    rating: number,       // Rating (0-5)
    reviews: number,      // Number of reviews
    image: string,       // Image URL path
    amenities: [{ icon: string, name: string }],
    rooms: number,       // Number of rooms
    link: string         // Detail page link
>>>>>>> ab0edb5 (added few features)
}
```

---

### 2. Bookings Service

<<<<<<< HEAD
**Service Variable:** `window.MutsBookingsService`

=======
>>>>>>> ab0edb5 (added few features)
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
<<<<<<< HEAD

=======
>>>>>>> ab0edb5 (added few features)
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

<<<<<<< HEAD
**Service Variable:** `window.MutsMessagesService`

=======
>>>>>>> ab0edb5 (added few features)
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
<<<<<<< HEAD

=======
>>>>>>> ab0edb5 (added few features)
```javascript
{
    id: string,
    type: string,         // 'support' | 'direct' | 'notification'
<<<<<<< HEAD
    participants: [
        { name: string, avatar: string, role: string }
    ],
    lastMessage: string,
    timestamp: string,   // ISO 8601
    unreadCount: number,
    messages: [
        { id: string, sender: string, text: string, time: string }
    ]
=======
    participants: [{ name: string, avatar: string, role: string }],
    lastMessage: string,
    timestamp: string,   // ISO 8601
    unreadCount: number,
    messages: [{ id: string, sender: string, text: string, time: string }]
>>>>>>> ab0edb5 (added few features)
}
```

---

### 4. Transactions Service

<<<<<<< HEAD
**Service Variable:** `window.MutsTransactionsService`

=======
>>>>>>> ab0edb5 (added few features)
**Base Endpoint:** `/api/transactions`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/summary` | Get spending summary |
| GET | `/api/transactions/:id` | Get transaction by ID |

**Summary Response:**
<<<<<<< HEAD

```javascript
{
    total: number,        // Total spending
    pending: number,     // Pending amount
    completed: number    // Completed amount
=======
```javascript
{
    total: number,     // Total spending
    pending: number,   // Pending amount
    completed: number  // Completed amount
>>>>>>> ab0edb5 (added few features)
}
```

**Transaction Object Schema:**
<<<<<<< HEAD

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
=======
```javascript
{
    id: string,        // Transaction ID (e.g., 'TXN-77421')
    date: string,      // ISO 8601 timestamp
    description: string,
    category: string,  // 'Safari' | 'Marketplace' | 'Hotel'
    type: string,      // 'Debit' | 'Credit'
    amount: number,
    status: string,   // 'completed' | 'pending' | 'failed'
    method: string    // Payment method
>>>>>>> ab0edb5 (added few features)
}
```

---

### 5. Destinations Service

<<<<<<< HEAD
**Service Variable:** `window.MutsDestinationsService`

=======
>>>>>>> ab0edb5 (added few features)
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
<<<<<<< HEAD

=======
>>>>>>> ab0edb5 (added few features)
```javascript
{
    id: string,
    name: string,
    region: string,
    description: string,
<<<<<<< HEAD
    duration: string,    // Display string (e.g., '3-7 Days')
=======
    duration: string,   // Display string (e.g., '3-7 Days')
>>>>>>> ab0edb5 (added few features)
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

<<<<<<< HEAD
**Service Variable:** `window.MutsListingsService`

=======
>>>>>>> ab0edb5 (added few features)
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
<<<<<<< HEAD

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
=======
```javascript
{ id: string, name: string, badge: string, description: string, duration: string, image: string, link: string }
```

**Package Object Schema:**
```javascript
{
    id: string, name: string, badge: string, description: string, image: string, link: string,
    hero: string, duration: string, overview: string,
    highlights: [{ title: string, desc: string }],
>>>>>>> ab0edb5 (added few features)
    includes: string[]
}
```

**Beach Object Schema:**
<<<<<<< HEAD

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
=======
```javascript
{
    id: string, name: string, badge: string, description: string, duration: string, image: string,
    link: string, hero: string, overview: string, highlights: [], activities: string[], bestTime: string
>>>>>>> ab0edb5 (added few features)
}
```

---

### 7. Africasa Service (Marketplace)

<<<<<<< HEAD
**Service Variable:** `window.MutsAfricasaService`

=======
>>>>>>> ab0edb5 (added few features)
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
<<<<<<< HEAD

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
=======
```javascript
{
    id: string, name: string, description: string, price: number, originalPrice: number,
    category: string, images: string[],
    details: { material: string, origin: string, artisan: string, size: string },
    stock: number, rating: number, reviews: number, featured: boolean
>>>>>>> ab0edb5 (added few features)
}
```

---

<<<<<<< HEAD
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

=======
## Manager Dashboard API

The Manager Dashboard is a separate subdomain with its own API base path.

### Manager Base Configuration

| Environment | Manager API Base URL |
|-------------|---------------------|
| Development | `http://localhost:3000/api/manager` |
| Staging | `https://staging-api.mutssafaris.com/api/manager` |
| Production | `https://api.mutssafaris.com/api/manager` |

### Manager Auth

Manager uses a separate session stored in `localStorage` with key `muts_manager_session`:
```javascript
{ token: string, userId: string, name: string, email: string, role: string, expiresAt: string }
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/manager/auth/login` | Manager login |

### Dashboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/dashboard/stats` | Dashboard statistics |
| GET | `/api/manager/dashboard/recent-bookings` | Recent bookings (supports ?limit=N) |
| GET | `/api/manager/dashboard/pending-messages` | Pending messages |
| GET | `/api/manager/dashboard/content-summary` | Content counts by type |

### Content Management Endpoints

#### Hotels CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/content/hotels` | List hotels (supports ?status, ?tier, ?search) |
| GET | `/api/manager/content/hotels/:id` | Get hotel by ID |
| POST | `/api/manager/content/hotels` | Create new hotel |
| PUT | `/api/manager/content/hotels/:id` | Update hotel |
| DELETE | `/api/manager/content/hotels/:id` | Delete hotel |
| POST | `/api/manager/content/hotels/:id/publish` | Publish hotel |

#### Destinations CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/content/destinations` | List destinations (supports ?status, ?type, ?search) |
| GET | `/api/manager/content/destinations/:id` | Get destination by ID |
| POST | `/api/manager/content/destinations` | Create new destination |
| PUT | `/api/manager/content/destinations/:id` | Update destination |
| DELETE | `/api/manager/content/destinations/:id` | Delete destination |
| POST | `/api/manager/content/destinations/:id/publish` | Publish destination |

#### Tours CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/content/tours` | List tours (supports ?status, ?search) |
| GET | `/api/manager/content/tours/:id` | Get tour by ID |
| POST | `/api/manager/content/tours` | Create new tour |
| PUT | `/api/manager/content/tours/:id` | Update tour |
| DELETE | `/api/manager/content/tours/:id` | Delete tour |

#### Packages CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/content/packages` | List packages (supports ?status, ?search) |
| GET | `/api/manager/content/packages/:id` | Get package by ID |
| POST | `/api/manager/content/packages` | Create new package |
| PUT | `/api/manager/content/packages/:id` | Update package |
| DELETE | `/api/manager/content/packages/:id` | Delete package |

#### Blogs CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/content/blogs` | List blogs (supports ?status, ?category, ?search) |
| GET | `/api/manager/content/blogs/:id` | Get blog by ID |
| POST | `/api/manager/content/blogs` | Create new blog |
| PUT | `/api/manager/content/blogs/:id` | Update blog |
| DELETE | `/api/manager/content/blogs/:id` | Delete blog |
| POST | `/api/manager/content/blogs/:id/publish` | Publish blog |

#### Africasa Products CRUD
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/content/products` | List products (supports ?category, ?search, ?featured) |
| GET | `/api/manager/content/products/:id` | Get product by ID |
| POST | `/api/manager/content/products` | Create new product |
| PUT | `/api/manager/content/products/:id` | Update product |
| DELETE | `/api/manager/content/products/:id` | Delete product |

### Bookings Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/bookings` | List bookings (supports ?status, ?search, ?dateFrom, ?dateTo) |
| GET | `/api/manager/bookings/:id` | Get booking by ID |
| PUT | `/api/manager/bookings/:id` | Update booking |
| PATCH | `/api/manager/bookings/:id/status` | Update booking status |
| POST | `/api/manager/bookings/:id/assign` | Assign guide to booking |

### Messages Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/messages` | List messages (supports ?status, ?type) |
| GET | `/api/manager/messages/:id` | Get message by ID |
| POST | `/api/manager/messages/:id/reply` | Reply to message |
| POST | `/api/manager/messages/:id/resolve` | Mark message as resolved |
| POST | `/api/manager/messages/send` | Send message to user |
| GET | `/api/manager/messages/sent` | Get sent messages |

### Analytics & Cache

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/analytics` | Get analytics (supports ?period) |
| GET | `/api/manager/cache/stats` | Get cache statistics |
| POST | `/api/manager/cache/clear` | Clear cache |

### Image Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/manager/images/upload` | Upload image |
| DELETE | `/api/manager/images/:id` | Delete image |
| GET | `/api/manager/images/categories` | Get image categories |

**Image Upload Details:**
```
POST /api/manager/images/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

Request Body:
- file: File (required) - Image file (JPEG, PNG, WebP, GIF)
- category: string (optional) - Category for organization (hotels, tours, blogs, etc.)
- entityType: string (optional) - Entity type (hotel, tour, blog, etc.)
- entityId: string (optional) - ID of associated entity

Response:
{
  "success": true,
  "url": "https://cdn.example.com/images/abc123.jpg",
  "id": "img_abc123",
  "filename": "hotel-image.jpg",
  "size": 245000,
  "type": "image/jpeg"
}
```

>>>>>>> ab0edb5 (added few features)
---

## Authentication

<<<<<<< HEAD
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
=======
### Public API Auth
- All authenticated endpoints require a valid JWT token
- Token passed via `Authorization: Bearer <token>` header
- Token refresh endpoint: `/api/auth/refresh`

### Manager API Auth
- Manager login: `/api/manager/auth/login`
- Returns JWT token stored in `muts_manager_session`
>>>>>>> ab0edb5 (added few features)

---

## Response Format

All API responses should follow this structure:

**Success:**
```javascript
<<<<<<< HEAD
{
    success: true,
    data: { ... },
    message: "Optional message"
}
=======
{ success: true, data: { ... }, message: "Optional message" }
>>>>>>> ab0edb5 (added few features)
```

**Error:**
```javascript
<<<<<<< HEAD
{
    success: false,
    error: "Error message",
    code: "ERROR_CODE"
}
=======
{ success: false, error: "Error message", code: "ERROR_CODE" }
>>>>>>> ab0edb5 (added few features)
```

---

<<<<<<< HEAD
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
=======
## Error Handling

- All endpoints should return appropriate HTTP status codes (200, 201, 400, 404, 500)
- Error responses must follow the error format above
- CORS must be enabled for all origins
- Request timeout should be handled (15-30 seconds)
- All endpoints must support JSON format

---

## WebSocket 

| Environment | WebSocket URL |
|-------------|---------------|
| Development | `ws://localhost:3000` |
| Staging | `wss://staging-api.mutssafaris.com` |
| Production | `wss://api.mutssafaris.com` |

**Potential use cases:**
- Real-time chat updates
- Live booking status
- Push notifications
>>>>>>> ab0edb5 (added few features)

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

<<<<<<< HEAD
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
=======
## Version History

- v1.0 - Initial API specification
- v1.1 - Added Manager Dashboard API endpoints

---

*Document Version: 1.1*
*Last Updated: 2026-04-12*
>>>>>>> ab0edb5 (added few features)
