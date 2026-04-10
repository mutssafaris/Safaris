# Muts Safaris Backend API Specification

## Overview

This document describes the backend API required to serve the Muts Safaris frontend. The frontend is a comprehensive tourism booking platform with two distinct user interfaces:
1. **Customer Dashboard** - Public-facing booking and content browsing
2. **Manager Dashboard** - Content management system for administrators

The frontend uses JavaScript services that follow a unified API pattern with fallback to mock data when API is unavailable.

---

## Base Configuration

### Environment
- **Development**: `http://localhost:3000/api`
- **Staging**: `https://staging-api.mutssafaris.com/api`
- **Production**: `https://api.mutssafaris.com/api`

### Authentication Header
```http
Authorization: Bearer {token}
```

### Response Format
All responses follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## 1. Authentication API

### Endpoints

#### POST /auth/login
**Purpose**: User login (customer)

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "usr-001",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+254700000000",
    "country": "Kenya"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-04-12T00:27:38+03:00"
}
```

#### POST /auth/register
**Purpose**: New user registration

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "+254700000000",
  "country": "Kenya",
  "interest": "safari",
  "newsletter": true
}
```

#### POST /auth/manager/login
**Purpose**: Manager/Admin login

**Request Body**:
```json
{
  "email": "manager@mutssafaris.com",
  "password": "admin123"
}
```

**Response**: Same as customer login with role field

#### POST /auth/logout
**Purpose**: Invalidate session

**Headers**: Required (Authorization Bearer token)

**Response**:
```json
{ "success": true }
```

#### GET /auth/me
**Purpose**: Get current authenticated user

**Headers**: Required

**Response**:
```json
{
  "success": true,
  "user": { ... }
}
```

#### PUT /auth/password
**Purpose**: Change password

**Headers**: Required

**Request Body**:
```json
{
  "currentPassword": "oldpass",
  "newPassword": "newpass123"
}
```

---

## 2. Hotels API

### Endpoints

#### GET /hotels
**Purpose**: List all hotels with filtering

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| location | string | Filter by location (maasai-mara,Amboseli,etc.) |
| tier | string | Filter by tier (luxury, mid-range, eco-budget) |
| status | string | Filter by status (published, draft) |
| search | string | Search by name/description |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| limit | number | Number of results |
| offset | number | Pagination offset |

**Response**:
```json
{
  "success": true,
  "hotels": [
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
      "image": "/images/hotels/governors-camp.jpg",
      "amenities": [
        { "icon": "📶", "name": "WiFi" },
        { "icon": "🏊", "name": "Pool" }
      ],
      "rooms": 25,
      "status": "published"
    }
  ],
  "total": 24,
  "page": 1,
  "limit": 20
}
```

#### GET /hotels/:id
**Purpose**: Get single hotel details

**Response**: Single hotel object with full details including additionalImages, rooms array, policies

#### POST /hotels
**Purpose**: Create new hotel (Manager)

**Headers**: Required (Manager role)

**Request Body**:
```json
{
  "name": "New Hotel",
  "tier": "luxury",
  "location": "maasai-mara",
  "locationName": "Maasai Mara",
  "description": "Hotel description",
  "price": 450,
  "image": "/images/hotels/new.jpg",
  "amenities": ["WiFi", "Pool", "Spa"],
  "rooms": 25,
  "status": "draft"
}
```

#### PUT /hotels/:id
**Purpose**: Update hotel (Manager)

#### DELETE /hotels/:id
**Purpose**: Delete hotel (Manager)

#### POST /hotels/:id/publish
**Purpose**: Publish hotel (Manager)

---

## 3. Destinations API

### Endpoints

#### GET /destinations
**Purpose**: List all destinations

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | safari, beach, city |
| status | string | published, draft |
| search | string | Search by name |

**Response**:
```json
{
  "success": true,
  "destinations": [
    {
      "id": "d1",
      "name": "Maasai Mara",
      "region": "Rift Valley",
      "type": "safari",
      "description": "World-famous wildlife reserve...",
      "highlights": ["Great Migration", "Big Five", "Hot Air Balloon"],
      "bestTime": "July-October",
      "image": "/images/destinations/maasai-mara.jpg",
      "priceFrom": 450,
      "rating": 4.9,
      "status": "published"
    }
  ]
}
```

#### GET /destinations/:id
#### POST /destinations (Manager)
#### PUT /destinations/:id (Manager)
#### DELETE /destinations/:id (Manager)
#### POST /destinations/:id/publish (Manager)

---

## 4. Tours API

### Endpoints

#### GET /tours
**Purpose**: List all tours

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| location | string | Filter by location |
| duration | string | e.g., "3-7 days" |
| difficulty | string | easy, moderate, challenging |
| status | string | published, draft |
| search | string | Search by name |

**Response**:
```json
{
  "success": true,
  "tours": [
    {
      "id": "t1",
      "name": "Maasai Mara Safari",
      "location": "maasai-mara",
      "duration": "3-7 Days",
      "difficulty": "easy",
      "description": "Experience the great migration...",
      "highlights": ["Big Five", "Great Migration", "Maasai Village"],
      "price": 450,
      "rating": 4.8,
      "includes": ["Accommodation", "Meals", "Game Drives", "Guide"],
      "image": "/images/tours/maasai-mara.jpg",
      "status": "published"
    }
  ]
}
```

#### GET /tours/:id
#### POST /tours (Manager)
#### PUT /tours/:id (Manager)
#### DELETE /tours/:id (Manager)

---

## 5. Packages API

### Endpoints

#### GET /packages
**Purpose**: List all travel packages

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | honeymoon, family, luxury, cultural |
| duration | string | e.g., "5-10 nights" |
| status | string | published, draft |
| search | string | Search |

**Response**:
```json
{
  "success": true,
  "packages": [
    {
      "id": "p1",
      "name": "Honeymoon Safari",
      "category": "honeymoon",
      "duration": "7 Nights",
      "description": "Romantic safari for couples...",
      "destinations": ["Maasai Mara", "Diani Beach"],
      "highlights": ["Private game drives", "Beach time", "Candle-lit dinners"],
      "price": 3500,
      "rating": 4.9,
      "includes": ["Flights", "Hotels", "Meals", "Transfers"],
      "image": "/images/packages/honeymoon.jpg",
      "status": "published"
    }
  ]
}
```

#### GET /packages/:id
#### POST /packages (Manager)
#### PUT /packages/:id (Manager)
#### DELETE /packages/:id (Manager)

---

## 6. Bookings API

### Endpoints

#### GET /bookings
**Purpose**: List user's bookings

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | string | Filter by user |
| status | string | upcoming, pending, confirmed, completed, cancelled |
| dateFrom | date | Filter by check-in date from |
| dateTo | date | Filter by check-in date to |
| limit | number | Pagination |
| offset | number | Pagination |

**Headers**: Required (User session)

**Response**:
```json
{
  "success": true,
  "bookings": [
    {
      "id": "BKG-001",
      "userId": "usr-001",
      "destination": "Maasai Mara Safari",
      "packageName": "Maasai Mara Safari",
      "checkin": "2026-04-18",
      "checkout": "2026-04-24",
      "adults": 2,
      "children": 1,
      "infants": 0,
      "totalPrice": 2100,
      "status": "upcoming",
      "createdAt": "2026-03-15T10:30:00Z",
      "notes": "First time visiting Kenya"
    }
  ]
}
```

#### GET /bookings/:id
**Purpose**: Get booking details

**Response**: Full booking object with paymentHistory, itinerary, guide assignment

#### POST /bookings
**Purpose**: Create new booking

**Request Body**:
```json
{
  "destination": "Maasai Mara Safari",
  "packageId": "p1",
  "checkin": "2026-04-18",
  "checkout": "2026-04-24",
  "adults": 2,
  "children": 1,
  "infants": 0,
  "specialRequests": "Vegetarian meals needed",
  "guestDetails": [
    { "name": "John Doe", "type": "adult" },
    { "name": "Jane Doe", "type": "adult" },
    { "name": "Kid Doe", "type": "child" }
  ]
}
```

#### PUT /bookings/:id
**Purpose**: Modify booking (dates, guests)

#### PUT /bookings/:id/status
**Purpose**: Update booking status (Customer)

**Request Body**:
```json
{
  "status": "cancelled",
  "reason": "Change of plans"
}
```

#### PUT /bookings/:id/status (Manager)
**Purpose**: Manager updates status

**Request Body**:
```json
{
  "status": "confirmed",
  "guide": "David Kimani"
}
```

#### POST /bookings/:id/assign
**Purpose**: Assign guide (Manager)

**Request Body**:
```json
{
  "guide": "David Kimani"
}
```

---

## 7. Payments API

### Endpoints

#### POST /payments/stripe/create-intent
**Purpose**: Create Stripe payment intent

**Request Body**:
```json
{
  "amount": 210000,  // Amount in cents
  "currency": "USD",
  "bookingId": "BKG-001",
  "metadata": {
    "customerEmail": "user@example.com",
    "bookingRef": "BKG-001"
  }
}
```

**Response**:
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentId": "PAY-001"
}
```

#### POST /payments/stripe/webhook
**Purpose**: Stripe webhook handler (no auth)

#### POST /payments/mpesa/stkpush
**Purpose**: Initiate M-Pesa STK Push

**Request Body**:
```json
{
  "phone": "254700000000",
  "amount": 2100,
  "bookingId": "BKG-001"
}
```

#### POST /payments/mpesa/callback
**Purpose**: M-Pesa callback (no auth)

#### GET /payments/:id
**Purpose**: Get payment status

#### GET /payments
**Purpose**: List user's payments

**Query Parameters**: bookingId, method, status

---

## 8. Reviews API

### Endpoints

#### GET /reviews
**Purpose**: Get reviews for items

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | hotel, destination, tour, package, product |
| itemId | string | ID of the item |
| limit | number | Number of reviews |

**Response**:
```json
{
  "success": true,
  "reviews": [
    {
      "id": "r1",
      "userId": "usr-001",
      "userName": "John D.",
      "rating": 5,
      "text": "Amazing experience!",
      "date": "2026-03-15",
      "helpful": 12
    }
  ],
  "rating": {
    "average": 4.8,
    "count": 156,
    "distribution": { "5": 89, "4": 45, "3": 15, "2": 5, "1": 2 }
  }
}
```

#### POST /reviews
**Purpose**: Submit review

**Headers**: Required

**Request Body**:
```json
{
  "itemType": "hotel",
  "itemId": "h1",
  "rating": 5,
  "text": "Amazing experience! The staff was..."
}
```

#### PUT /reviews/:id
**Purpose**: Update own review

#### DELETE /reviews/:id
**Purpose**: Delete own review

---

## 9. Messages API

### Endpoints

#### GET /messages
**Purpose**: Get user's messages

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| folder | string | inbox, sent |
| status | string | read, unread |
| type | string | support, inquiry, feedback |

**Response**:
```json
{
  "success": true,
  "messages": [
    {
      "id": "MSG-001",
      "from": "Muts Safaris Team",
      "fromEmail": "info@mutssafaris.com",
      "subject": "Booking Confirmed",
      "body": "Your booking is confirmed...",
      "read": false,
      "createdAt": "2026-03-30T10:00:00Z"
    }
  ]
}
```

#### GET /messages/:id

#### POST /messages
**Purpose**: Send message to support

**Request Body**:
```json
{
  "subject": "Question about safari",
  "type": "inquiry",
  "message": "I'd like to know more about..."
}
```

#### POST /messages/:id/reply
**Purpose**: Reply to message (Manager)

#### POST /messages/:id/resolve
**Purpose**: Mark as resolved (Manager)

#### POST /messages/send
**Purpose**: Send message to user (Manager)

**Request Body**:
```json
{
  "to": "user@example.com",
  "name": "John",
  "type": "notification",
  "subject": "Booking Reminder",
  "message": "Your safari is tomorrow..."
}
```

---

## 10. User Management API

### Endpoints

#### GET /users
**Purpose**: List users (Manager only)

**Query Parameters**: role, status, search

#### GET /users/:id

#### PUT /users/:id
**Purpose**: Update user profile

#### DELETE /users/:id
**Purpose**: Deactivate user (Manager)

---

## 11. Blog API

### Endpoints

#### GET /blog/posts
**Purpose**: Get all blog posts

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | guide, news, story |
| status | string | published, draft |
| tag | string | Filter by tag |
| limit | number |
| offset | number |
| search | string |

**Response**:
```json
{
  "success": true,
  "posts": [
    {
      "id": "bp1",
      "title": "Best Time to Visit Kenya",
      "slug": "best-time-visit-kenya",
      "category": "guide",
      "excerpt": "Planning your safari...",
      "content": "Full HTML content...",
      "image": "/images/blog/best-time.jpg",
      "author": "Muts Team",
      "tags": ["kenya", "safari", "planning"],
      "publishedAt": "2026-04-01T00:00:00Z",
      "status": "published"
    }
  ],
  "categories": ["guide", "news", "story"],
  "total": 45
}
```

#### GET /blog/posts/:slug

#### POST /blog/posts (Manager)
**Request Body**:
```json
{
  "title": "New Post",
  "category": "guide",
  "content": "Full HTML content...",
  "image": "/images/blog/new.jpg",
  "tags": ["safari", "kenya"],
  "status": "draft"
}
```

#### PUT /blog/posts/:id (Manager)

#### DELETE /blog/posts/:id (Manager)

#### POST /blog/posts/:id/publish (Manager)

---

## 12. Africasa Products API

### Endpoints

#### GET /products
**Purpose**: List products (handicrafts)

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | jewelry, art, textiles |
| featured | boolean | Filter featured |
| search | string |

**Response**:
```json
{
  "success": true,
  "products": [
    {
      "id": "prod-001",
      "name": "Maasai Beaded Necklace",
      "category": "jewelry",
      "description": "Handcrafted by Maasai women...",
      "price": 89.99,
      "images": ["/images/products/necklace1.jpg"],
      "stock": 15,
      "featured": true,
      "artist": "Maasai Women's Group"
    }
  ]
}
```

#### GET /products/:id

#### POST /products (Manager)

#### PUT /products/:id (Manager)

#### DELETE /products/:id (Manager)

---

## 13. Dashboard API (Manager)

### Endpoints

#### GET /dashboard/stats
**Purpose**: Get dashboard statistics

**Response**:
```json
{
  "success": true,
  "stats": {
    "totalBookings": 24,
    "pendingMessages": 5,
    "publishedHotels": 18,
    "totalRevenue": 45200,
    "bookingsChange": 12,
    "revenueChange": 8,
    "lastMonthBookings": 21,
    "lastMonthRevenue": 41800
  }
}
```

#### GET /dashboard/recent-bookings
**Query Parameters**: limit (default 5)

#### GET /dashboard/pending-messages

#### GET /dashboard/content-summary

---

## 14. Search API

### Endpoints

#### GET /search
**Purpose**: Global search

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Search query (required) |
| types | string | Comma-separated: hotels,tours,packages,destinations,blogs |
| location | string | Filter by location |
| minPrice | number |
| maxPrice | number |
| limit | number |

**Response**:
```json
{
  "success": true,
  "results": [
    {
      "type": "hotel",
      "id": "h1",
      "title": "Governors' Camp",
      "subtitle": "Maasai Mara - Luxury",
      "image": "/images/hotels/governors-camp.jpg",
      "price": 450,
      "url": "/pages/dashboard/hotels/luxury/maasai-mara-lodge.html",
      "score": 0.95
    },
    {
      "type": "tour",
      "id": "t1",
      "title": "Maasai Mara Safari",
      "subtitle": "3-7 Days",
      "price": 450,
      "url": "/pages/dashboard/tours/maasai-mara.html"
    }
  ],
  "total": 15
}
```

---

## 15. Analytics API (Manager)

### Endpoints

#### GET /analytics
**Query Parameters**: period (today, week, month, year)

**Response**:
```json
{
  "success": true,
  "analytics": {
    "pageViews": 15420,
    "uniqueVisitors": 8920,
    "bookings": 24,
    "revenue": 45200,
    "topDestinations": [
      { "name": "Maasai Mara", "bookings": 12 },
      { "name": "Diani Beach", "bookings": 8 }
    ],
    "conversionRate": 3.2
  }
}
```

---

## 16. Favorites API

### Endpoints

#### GET /favorites
**Purpose**: Get user's saved items

**Response**:
```json
{
  "success": true,
  "favorites": [
    {
      "type": "hotel",
      "id": "h1",
      "savedAt": "2026-03-15T10:00:00Z"
    },
    {
      "type": "tour",
      "id": "t1",
      "savedAt": "2026-03-20T14:30:00Z"
    }
  ]
}
```

#### POST /favorites
**Purpose**: Add to favorites

**Request Body**:
```json
{
  "type": "hotel",
  "itemId": "h1"
}
```

#### DELETE /favorites/:type/:itemId
**Purpose**: Remove from favorites

---

## 17. Transactions API

### Endpoints

#### GET /transactions
**Purpose**: Get user's transaction history

**Query Parameters**: type (booking, payment, refund), status

**Response**:
```json
{
  "success": true,
  "transactions": [
    {
      "id": "TXN-001",
      "type": "Booking",
      "description": "Maasai Mara Safari (6 nights)",
      "amount": 2100,
      "status": "Pending",
      "date": "2026-03-15T10:30:00Z"
    }
  ]
}
```

---

## 18. Manager-Specific Endpoints

### Content Management

All content types support full CRUD:
- `/content/hotels` - Hotels management
- `/content/destinations` - Destinations management
- `/content/tours` - Tours management
- `/content/packages` - Packages management
- `/content/blogs` - Blog posts management
- `/content/products` - Africasa products management

Each supports:
- `GET /` - List with filters
- `GET /:id` - Get single
- `POST /` - Create
- `PUT /:id` - Update
- `DELETE /:id` - Delete
- `POST /:id/publish` - Publish draft
- `POST /:id/duplicate` - Duplicate item

### Cache Management (Manager)

#### GET /cache/stats
**Purpose**: Get cache statistics

#### DELETE /cache/:type
**Purpose**: Clear cache (hotels, destinations, tours, packages, all)

---

## Data Models

### User Model
```json
{
  "id": "usr-001",
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "+254700000000",
  "country": "Kenya",
  "role": "user",
  "avatar": "/images/users/avatar.jpg",
  "createdAt": "2025-01-15T10:00:00Z",
  "lastLogin": "2026-04-11T08:30:00Z"
}
```

### Manager User Model
```json
{
  "id": "mgr-001",
  "name": "Manager Name",
  "email": "manager@mutssafaris.com",
  "role": "manager|admin|support",
  "permissions": ["hotels", "bookings", "messages", "analytics"],
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### Hotel Model
```json
{
  "id": "h1",
  "name": "Governors' Camp",
  "badge": "Luxury",
  "tier": "luxury",
  "location": "mara",
  "locationName": "Maasai Mara",
  "description": "Full description...",
  "price": 450,
  "rating": 4.9,
  "reviews": 234,
  "image": "/images/hotels/governors-camp.jpg",
  "images": ["/images/hotels/gallery/1.jpg", "...", "..."],
  "amenities": [
    { "icon": "📶", "name": "WiFi" },
    { "icon": "🏊", "name": "Pool" }
  ],
  "rooms": 25,
  "roomTypes": [
    { "type": "Tent", "count": 20, "price": 450 },
    { "type": "Suite", "count": 5, "price": 750 }
  ],
  "policies": {
    "checkIn": "12:00",
    "checkOut": "10:00",
    "cancellation": "Free cancellation up to 7 days"
  },
  "status": "published",
  "createdAt": "2025-06-01T00:00:00Z",
  "updatedAt": "2026-03-15T00:00:00Z"
}
```

### Booking Model
```json
{
  "id": "BKG-001",
  "userId": "usr-001",
  "destination": "Maasai Mara Safari",
  "packageId": "p1",
  "checkin": "2026-04-18",
  "checkout": "2026-04-24",
  "adults": 2,
  "children": 1,
  "infants": 0,
  "guestDetails": [
    { "name": "John Doe", "type": "adult", "age": 35 },
    { "name": "Jane Doe", "type": "adult", "age": 32 },
    { "name": "Kid Doe", "type": "child", "age": 8 }
  ],
  "totalPrice": 2100,
  "depositPaid": 420,
  "status": "upcoming",
  "notes": "First time visiting Kenya",
  "specialRequests": "Vegetarian meals",
  "guide": "David Kimani",
  "createdAt": "2026-03-15T10:30:00Z",
  "updatedAt": "2026-03-20T14:00:00Z"
}
```

### Blog Post Model
```json
{
  "id": "bp1",
  "title": "Best Time to Visit Kenya",
  "slug": "best-time-visit-kenya",
  "category": "guide",
  "excerpt": "Short preview...",
  "content": "<p>Full HTML content...</p>",
  "image": "/images/blog/best-time.jpg",
  "gallery": ["/images/blog/gallery/1.jpg", "...", "..."],
  "author": {
    "id": "mgr-001",
    "name": "Manager Name"
  },
  "tags": ["kenya", "safari", "planning", "great-migration"],
  "seo": {
    "title": "Best Time to Visit Kenya - Safari Guide",
    "description": "Complete guide to when to visit Kenya..."
  },
  "publishedAt": "2026-04-01T00:00:00Z",
  "status": "published",
  "views": 1250,
  "createdAt": "2026-03-28T10:00:00Z",
  "updatedAt": "2026-04-01T00:00:00Z"
}
```

---

## Security Requirements

### Authentication
- JWT tokens with 24-hour expiry (configurable)
- Secure password hashing (bcrypt with salt)
- Rate limiting on login attempts (5 attempts, 15-minute lockout)

### Authorization
- Role-based access control (user, manager, admin)
- Manager endpoints require manager role
- API key for service-to-service communication

### Headers Required
```http
Content-Type: application/json
Authorization: Bearer {token}
```

### Security Headers (to implement)
- `Strict-Transport-Security: max-age=31536000`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## Pagination

All list endpoints support:
- `limit` - Number of results (default 20, max 100)
- `offset` - Starting position

Response includes:
```json
{
  "total": 150,
  "page": 2,
  "limit": 20,
  "hasMore": true
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| AUTH_001 | Invalid credentials |
| AUTH_002 | Account locked |
| AUTH_003 | Session expired |
| AUTH_004 | Unauthorized |
| BOOKING_001 | Booking not found |
| BOOKING_002 | Invalid dates |
| BOOKING_003 | Already cancelled |
| PAYMENT_001 | Payment failed |
| PAYMENT_002 | Invalid amount |
| VALIDATION_001 | Invalid input |
| NOT_FOUND_001 | Resource not found |

---

## Webhook Endpoints (No Auth)

- `POST /payments/stripe/webhook` - Stripe events
- `POST /payments/mpesa/callback` - M-Pesa callbacks

These endpoints should verify webhook signatures before processing.

---

## Implementation Notes

1. **Fallback Behavior**: When API is unavailable, frontend falls back to mock data. Backend should be stable to prevent this.

2. **Image Handling**: Frontend expects image URLs. Backend should serve images from CDN or local storage.

3. **Real-time Features**: Not currently implemented but prepared for WebSocket support (`ws://` or `wss://`)

4. **Caching**: Frontend uses localStorage caching. Backend should support cache invalidation via the `/cache/clear` endpoint.

5. **Email Notifications**: Backend should trigger emails for: booking confirmation, payment received, booking reminders, password changes, message replies