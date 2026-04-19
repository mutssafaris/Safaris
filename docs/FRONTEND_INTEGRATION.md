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
| Tours | MutsToursService | GET /api/tours, GET /api/tours/{id} | ✅ Mock ready (data/tours.json) |
| Experiences | MutsExperiencesService | GET /api/experiences | ✅ Mock ready (data/tours.json) |
| Loyalty/Points | MutsLoyaltyService | GET /api/loyalty/profile, /api/loyalty/transactions, POST /api/loyalty/redeem | ✅ Mock ready (data/loyalty.json) |
| Bookings | MutsBookingsService | GET /api/bookings | ✅ Mock ready |
| Messages | MutsMessagesService | GET /api/messages | ✅ Mock ready |
| Transactions | MutsTransactionsService | GET /api/transactions, /api/transactions/{id}, /api/transactions/summary | ✅ Mock ready |
| Notifications | MutsNotificationsService | GET /api/notifications | ✅ Mock ready |
| Localization | MutsI18n | GET /api/localization/strings | ✅ Fallback ready |

---
/
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
POST /api/auth/social/google
POST /api/auth/social/facebook
POST /api/auth/social/apple
POST /api/auth/apply-referral   // Apply referral code after signup
```

**Register Request Body:**
```javascript
// POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "+254712345678",
  "country": "KE",
  "interest": "safari",
  "referralCode": "MUTS-GOLD-7X4K9",  // Optional - earns 500 bonus points
  "newsletter": true
}
```

**Register Response:**
```javascript
{
  "success": true,
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "tier": "bronze",
    "referralCode": "MUTS-BRONZE-ABCD1",
    "referredBy": "MUTS-GOLD-7X4K9",  // Code used (if any) - different from own referralCode
    "points": 500,  // Bonus points from using referral code
    "referralCount": 0  // How many people used YOUR code
  },
  "token": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

**User Profile Fields for Referral:**
```javascript
// Full user object includes:
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "tier": "gold",
  "referralCode": "MUTS-GOLD-7X4K9",     // User's own code to share
  "referredBy": "MUTS-SILVER-XY12",     // Code user used when they signed up
  "referralCount": 3,                  // How many people used this user's code
  "points": 2450,
  "createdAt": "2024-08-15",
  "referredUsers": [                     // Optional: list of users who used this code
    { "id": "user_456", "name": "Jane", "date": "2024-09-01" },
    { "id": "user_789", "name": "Bob", "date": "2024-10-15" }
  ]
}
```

### 4.1 Social Login Endpoints (Required for OAuth)

**Request Schemas:**

```javascript
// POST /api/auth/social/google
// Body: { idToken: "JWT_from_google" }
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@gmail.com",
      "avatar": "https://...",
      "provider": "google",
      "providerId": "google:123456789"
    },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}

// POST /api/auth/social/facebook
// Body: { accessToken: "facebook_access_token" }

// POST /api/auth/social/apple
// Body: { idToken: "JWT_from_apple" }
```

**Backend Requirements:**

1. **Google OAuth**
   - Create OAuth 2.0 client in Google Cloud Console
   - Client ID: `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`
   - Verify JWT signature with Google's public keys
   - Extract user info from `sub` claim
   - Link or create user record with `provider: 'google'` and `providerId: 'google:' + sub`

2. **Facebook OAuth**
   - Create Facebook App in Meta Developer Portal
   - Get App ID and App Secret
   - Exchange code for access token
   - Fetch user info from `/me` Graph API endpoint
   - Link or create user with `provider: 'facebook'`

3. **Apple Sign-In**
   - Configure App ID with Sign in with Apple capability
   - Verify JWT using Apple's public keys
   - Extract user info from identity token
   - Handle email privacy (may be "relay" email)

4. **User Creation/Linking Logic**
   ```javascript
   // Pseudo-code for user creation:
   function handleSocialUser(provider, providerId, email, name, avatar) {
       let user = users.find(u => u.providerId === providerId);
       if (user) {
           // Existing social user - update tokens
           user.accessToken = newToken;
           user.refreshToken = newRefreshToken;
           return user;
       }
       
       // Check if email exists (regular account)
       let existingUser = users.find(u => u.email === email);
       if (existingUser) {
           // Link social to existing account
           existingUser.provider = provider;
           existingUser.providerId = providerId;
           return existingUser;
       }
       
       // Create new social user
       user = {
           id: generateId(),
           email: email,
           name: name,
           avatar: avatar,
           provider: provider,
           providerId: providerId,
           tier: 'explorer',
           createdAt: new Date().toISOString()
       };
       users.push(user);
       return user;
   }
   ```

5. **Security Considerations**
   - Validate `idToken` JWT signatures server-side
   - Verify `aud` claim matches your client ID
   - Check token expiry
   - Store refresh tokens securely
   - Implement CSRF protection with state parameter
   - Rate limit social login endpoints

6. **Frontend Configuration**
   - Update `GOOGLE_CLIENT_ID` in `login.html`
   - Configure `FB_APP_ID` for Facebook SDK
   - Configure Apple Service ID in dashboard

7. **Client ID Setup Notes**
   - Google: Update in `login.html` - `GOOGLE_CLIENT_ID` variable
   - Facebook: Set in FB.init() call or app config
   - Apple: Configure in Apple Developer Portal

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

### 8. Tours/Experiences
```
GET /api/tours
GET /api/tours/{id}
GET /api/tours?type=safari|adventure|cultural|wildlife
GET /api/tours?duration=short|medium|long
GET /api/experiences
GET /api/experiences?type=adventure|cultural|wildlife
GET /api/experiences?duration=half-day|full-day|multi-day
```

**Response Schemas:**

```javascript
// GET /api/tours
{
  "success": true,
  "data": {
    "destinations": [
      {
        "id": 1,
        "name": "Maasai Mara National Reserve",
        "slug": "maasai-mara",
        "region": "Southwest Kenya",
        "description": "Famous for the Great Migration...",
        "highlights": ["Great Migration", "Big Five"],
        "duration": "long",
        "rating": 4.9,
        "priceRange": "$$$"
      }
    ]
  }
}

// GET /api/tours/{id}
{
  "success": true,
  "data": {
    "id": "t1",
    "name": "Maasai Mara Safari",
    "type": "safari",
    "duration": "5 days",
    "price": 2500,
    "rating": 4.9,
    "location": "Maasai Mara",
    "highlights": ["Big Five", "Great Migration"],
    "includes": ["Accommodation", "Meals", "Game Drives"],
    "itinerary": [
      { "day": 1, "title": "Arrival", "description": "..." },
      { "day": 2, "title": "Game Drive", "description": "..." }
    ]
  }
}
```

### 9. Localization
```
GET /api/localization/strings?lang=en
```

### 10. Loyalty/Points
```
GET /api/loyalty/profile
GET /api/loyalty/transactions
GET /api/loyalty/referral-code
POST /api/loyalty/redeem?points={amount}&bookingId={id}
POST /api/loyalty/refer?code={referralCode}
GET /api/loyalty/calculate?points={amount}
GET /api/loyalty/tiers
GET /api/loyalty/redeem-options
POST /api/loyalty/generate-referral-code   // Generate/regenerate user's code
```

**Auth:** All endpoints require `Authorization: Bearer {token}` header (user JWT)

**Important Validation Notes:**

1. **Referral Code Validation:**
   - Validate format: `^MUTS-[A-Z0-9]{4,6}-[A-Z0-9]{4,6}$`
   - Check code exists in database
   - Check code belongs to DIFFERENT user (prevent self-use)
   - Check user hasn't already used a referral code (`referredBy` IS NULL)

2. **Points Awarding (Backend Must Handle):**
   - When code is used at signup: Award 500 points to NEW USER
   - When code is used: Award 500 points to REFERRER (increment their `referralCount`)
   - Both should happen in a single transaction

3. **Transaction Descriptions:**
   - New user: "Welcome Bonus - Used referral code"
   - Referrer: "Referral Bonus - [new_user_name] used your code"

4. **Code Generation:**
   - Each user should have exactly ONE referral code
   - Code format: `MUTS-{USER_TIER}-{RANDOM}` (e.g., `MUTS-GOLD-7X4K9`)
   - If user regenerates, invalidate old code (or allow multiple codes)

**Response Schemas:**

```javascript
// GET /api/loyalty/profile
{
  "success": true,
  "data": {
    "userId": "user_12345",
    "points": 2450,
    "lifetimePoints": 4780,
    "tier": "gold",
    "totalSpent": 12450,
    "nextTier": "platinum",
    "pointsToNextTier": 5220,
    "tierProgress": 32,
    "referralCode": "MUTS-GOLD-7X4K9",
    "referralCount": 3,
    "memberSince": "2024-08-15"
  }
}

// GET /api/loyalty/transactions
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "pt_001",
        "type": "earned",
        "description": "Safari Booking - Maasai Mara",
        "points": 1200,
        "date": "2026-04-10T14:30:00Z",
        "bookingId": "BK-77421"
      },
      {
        "id": "pt_007",
        "type": "redeemed",
        "description": "Discount Redemption",
        "points": -500,
        "date": "2026-01-10T14:00:00Z"
      }
    ],
    "total": 15,
    "page": 1
  }
}

// POST /api/loyalty/redeem?points=500
{
  "success": true,
  "message": "500 points redeemed successfully",
  "data": {
    "pointsRedeemed": 500,
    "discount": 75,
    "newBalance": 1950,
    "bookingId": null,
    "discountCode": "LOYALTY-2026-ABCD"
  }
}

// GET /api/loyalty/redeem-options
{
  "success": true,
  "data": [
    { "points": 100, "value": 10, "label": "$10 off booking" },
    { "points": 250, "value": 30, "label": "$30 off booking" },
    { "points": 500, "value": 75, "label": "$75 off booking" },
    { "points": 1000, "value": 175, "label": "$175 off booking" },
    { "points": 2000, "value": 400, "label": "$400 off booking" }
  ]
}

// GET /api/loyalty/tiers
{
  "success": true,
  "data": [
    { "name": "Bronze", "minPoints": 0, "maxPoints": 999, "multiplier": 1, "benefits": ["Base points earning", "Member welcome bonus"] },
    { "name": "Silver", "minPoints": 1000, "maxPoints": 4999, "multiplier": 1.25, "benefits": ["+25% points", "Early access to deals"] },
    { "name": "Gold", "minPoints": 5000, "maxPoints": 14999, "multiplier": 1.5, "benefits": ["+50% points", "Free room upgrades", "Priority support"] },
    { "name": "Platinum", "minPoints": 15000, "maxPoints": null, "multiplier": 2, "benefits": ["2x points", "VIP support", "Exclusive experiences", "Annual bonus"] }
  ]
}

// POST /api/loyalty/refer?code=MUTS-GOLD-7X4K9
{
  "success": true,
  "message": "Referral code applied successfully",
  "data": {
    "bonusPoints": 500,
    "referredCode": "MUTS-GOLD-7X4K9"
  }
}

// Error Responses
{
  "success": false,
  "message": "Insufficient points for redemption"
}
{
  "success": false,
  "message": "Invalid or expired referral code"
}
{
  "success": false,
  "message": "Referral code already used"
}
```

**Tier System:**
| Tier | Points Range | Multiplier | Benefits |
|------|-------------|------------|-----------|
| Bronze | 0-999 | 1x | Base points |
| Silver | 1,000-4,999 | 1.25x | +25% points, early access |
| Gold | 5,000-14,999 | 1.5x | +50%, free upgrades |
| Platinum | 15,000+ | 2x | VIP, exclusive experiences |

**Ways to Earn Points:**
| Action | Points Earned |
|--------|---------------|
| Book Safari/Tour | 1 point per $1 spent |
| Refer Friend | 500 bonus points |
| Write Review | 100 points |
| Share Experience | 50 points |

**Points Expiration:** Points expire after 12 months of inactivity. Active bookings reset expiration.

### Referral Program

**How it Works:**
1. Each member receives a unique referral code on signup (format: `MUTS-{TIER}-{CODE}`)
2. Share your code with friends - they get points on signup, you get 500 bonus points when they use it
3. Each account can only use ONE referral code (one-time use)
4. Referral codes never expire
5. Both parties get 500 points: referrer (who owns code) + referred (new user)

**Backend Logic Required:**

```
Referral Code Usage Flow:
1. User A shares referral code "MUTS-GOLD-7X4K9"
2. New User B signs up with code "MUTS-GOLD-7X4K9"
3. Backend:
   a. Find User A by referralCode
   b. Increment User A's referralCount by 1
   c. Add 500 points to User A's account (referrer bonus)
   d. Create transaction record: "Referral Bonus - User B used your code"
   e. Create User B with referredBy = "MUTS-GOLD-7X4K9"
   f. Add 500 points to User B's account (signup bonus)
   g. Create transaction record: "Welcome Bonus - Used referral code"
4. Return success to both callers
```

**Points Distribution:**
| Action | Points | Recipient | Transaction Description |
|--------|--------|-----------|---------------------|
| Sign up with referral code | +500 | NEW USER | "Welcome Bonus - Used referral code" |
| Someone used your code | +500 | REFERRER | "Referral Bonus - [name] used your code" |

**Signup Integration:**
- Referral code field on signup form (optional)
- Validates format: `MUTS-XXXX-XXXX`
- 500 bonus points awarded on successful signup
- Referral bonus applied automatically after account creation
- `referredBy` field stored on new user's profile

**Referral Code Format:**
- Prefix: `MUTS-`
- Tier: `BRONZE`, `SILVER`, `GOLD`, or `PLATINUM`
- Code: 6-character alphanumeric (e.g., `7X4K9`)
- Example: `MUTS-GOLD-7X4K9`
- Note: Tier in code reflects REFERRER's tier, not new user's tier

**Referral API Endpoints:**
```
GET /api/loyalty/referral-code         // Get user's own referral code
POST /api/loyalty/generate-referral-code  // Regenerate new code (if needed)
POST /api/loyalty/refer?code={code}   // Apply someone else's referral code
POST /api/auth/register         // Include referralCode in body
GET /api/users/{id}/referrals   // Get users who used your code (optional)
```

**Apply Referral Response:**
```javascript
// POST /api/loyalty/refer?code=MUTS-GOLD-7X4K9
{
  "success": true,
  "message": "Referral code applied successfully",
  "data": {
    "bonusPoints": 500,
    "referredCode": "MUTS-GOLD-7X4K9",
    "newPointsBalance": 2950
  }
}

// Error: Code already used
{
  "success": false,
  "message": "Referral code already used"
}

// Error: Invalid code
{
  "success": false,
  "message": "Invalid referral code"
}

// Error: Using own code
{
  "success": false,
  "message": "Cannot use your own referral code"
}

// Error: User already used a code
{
  "success": false,
  "message": "You have already used a referral code"
}
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

## Manager Dashboard API

**Base Endpoint:** `/api/manager/dashboard`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/dashboard/stats` | Get dashboard statistics |
| GET | `/api/manager/dashboard/recent-bookings` | Get recent bookings |
| GET | `/api/manager/dashboard/pending-messages` | Get pending messages |
| GET | `/api/manager/dashboard/content-summary` | Get content summary |

**Response Schemas:**

```javascript
// GET /api/manager/dashboard/stats
{
  "success": true,
  "data": {
    "totalBookings": 24,
    "pendingMessages": 5,
    "publishedHotels": 18,
    "totalRevenue": 45200,
    "bookingsChange": 12,
    "hotelsChange": -2,
    "revenueChange": 8
  }
}

// GET /api/manager/dashboard/recent-bookings
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "BKG-001",
        "destination": "Maasai Mara Safari",
        "adults": 2,
        "children": 1,
        "checkin": "2026-04-18",
        "status": "upcoming",
        "totalPrice": 2100
      }
    ],
    "total": 5
  }
}

// GET /api/manager/dashboard/content-summary
{
  "success": true,
  "data": {
    "hotels": { "total": 24, "published": 18, "draft": 6 },
    "tours": { "total": 15, "published": 12, "draft": 3 },
    "packages": { "total": 8, "published": 6, "draft": 2 },
    "blogs": { "total": 45, "published": 38, "draft": 7 },
    "destinations": { "total": 12, "published": 10, "draft": 2 }
  }
}
```

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
// Response can be either:
// Option 1: { success: true, data: { hotels: [...], total: N, page: 1, limit: 20 } }
// Option 2: { success: true, data: [...] } (direct array)
// Option 3: [...](direct array from mock fallback)

// Mock Data Fallback: /data/hotels.json
{
  "hotels": [
    {
      "id": "h1",
      "name": "Governors' Camp",
      "badge": "Luxury",
      "tier": "luxury",
      "location": "mara",
      "locationName": "Maasai Mara",
      "description": "Luxury tented camp with exceptional...",
      "price": 450,
      "rating": 4.9,
      "reviews": 234,
      "image": "../../images/hotels/governors-camp.jpg",
      "amenities": [
        { "icon": "📶", "name": "WiFi" },
        { "icon": "🏊", "name": "Pool" }
      ],
      "rooms": 25,
      "link": "hotels/luxury/maasai-mara-lodge.html"
    }
  ]
}

// Hotel Object Field Mappings (for robust handling):
// - id: hotel.id
// - name: hotel.name
// - tier: hotel.tier ("luxury" | "mid-range" | "eco-budget")
// - price/basePrice: hotel.price
// - locationName/location: hotel.locationName || hotel.location
// - status: hotel.status (default "published" if missing)
// - rating: hotel.rating
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


// Login/Register response
{
  "success": true,
  "user": {...},
  "token": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}

// Refresh endpoint
POST /auth/refresh
{ "refreshToken": "..." }
Response: { "success": true, "token": "new_token", "refreshToken": "new_refresh" }

## Notes

- All services automatically fall back to mock data if API unavailable
- Manager dashboard requires JWT token in Authorization header
- JWT expires after 24 hours
- Public endpoints accessible without auth
- Role-based access control enforced server-side
- LocalStorage used for caching user-specific data

---

*Last Updated: 2026-04-17*
---

## Destinations API - Security & Implementation Notes

### Known Issues & Fixes Applied (2026-04-17)

1. **Image Path Bug** - Fixed in `tours.html`: Now derives image folder from destination type:
   ```javascript
   var imageFolder = (dest.type === 'beach') ? 'beaches' : 'tours';
   var imagePath = '../../images/' + imageFolder + '/' + dest.image;
   ```

2. **Type Filter Fallback** - Fixed in `list.html`: Derives type when missing in mock data:
   ```javascript
   if (filters.type === 'beach') return d.region.toLowerCase().includes('coast');
   if (filters.type === 'safari') return !d.region.includes('coast');
   ```

3. **Price Range Conversion** - Fixed incorrect mapping:
   ```javascript
   var rangeMap = { '$': 150, '$$': 350, '$$$': 600, '$$$$': 1000 };
   ```

4. **XSS Prevention** - All toast messages now use HTML encoding:
   ```javascript
   function encodeHTML(str) {
       var div = document.createElement('div');
       div.textContent = str;
       return div.innerHTML;
   }
   ```

### Security Best Practices

- **Never use eval()** - Use function lookup instead: `window[functionName]`
- **Always encode user input** - Use `encodeHTML()` before inserting into innerHTML
- **Use crypto.getRandomValues()** - For tokens and salt generation
- **Check localStorage quota** - Before storing large data
- **Token in Authorization header**: `Authorization: Bearer <token>`

---

## Manager Destinations API

**Base Endpoint:** `/api/manager/content/destinations`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/content/destinations` | List all destinations |
| GET | `?type=safari` | Filter by type |
| GET | `?status=published` | Filter by status |
| GET | `?search=maasai` | Search destinations |
| GET | `/api/manager/content/destinations/:id` | Get destination details |
| POST | `/api/manager/content/destinations` | Create destination |
| PUT | `/api/manager/content/destinations/:id` | Update destination |
| DELETE | `/api/manager/content/destinations/:id` | Delete destination |
| POST | `/api/manager/content/destinations/:id/publish` | Publish destination |
| POST | `/api/manager/content/destinations/:id/unpublish` | Unpublish destination |

**Request/Response Schemas:**

```javascript
// POST /api/manager/content/destinations
{
  "name": "Maasai Mara National Reserve",
  "slug": "maasai-mara",               // URL-friendly slug, auto-generated if empty
  "region": "Southwest Kenya",
  "type": "safari",                    // "safari" | "beach" | "mountain" | "lake" | "city"
  "description": "Famous for the Great Migration...",
  "priceFrom": 450,                    // Starting price in USD
  "rating": 4.9,                       // 0-5 scale
  "status": "published",               // "published" | "draft"
  "bestTime": "Jun-Oct",               // Best visiting months
  "duration": "long",                  // "short" | "medium" | "long"
  "highlights": ["Great Migration", "Big Five", "Hot Air Balloon"],
  "image": "https://cdn.example.com/images/dest-1.jpg",
  "gallery": ["url1", "url2"],
  "tags": ["Most Popular", "Big Five"] // optional
}

// GET /api/manager/content/destinations
// Response can be either:
// Option 1: { success: true, data: { destinations: [...], total: N, page: 1, limit: 20 } }
// Option 2: { success: true, data: [...] } (direct array)

// Mock Data Fallback: /data/destinations.json
{
  "destinations": [
    {
      "id": 1,
      "name": "Maasai Mara National Reserve",
      "slug": "maasai-mara",
      "region": "Southwest Kenya",
      "description": "Famous for Great Migration...",
      "highlights": ["Great Migration", "Big Five", "Hot Air Balloon"],
      "bestTime": "Jun-Oct",
      "duration": "long",
      "season": "jun-oct",
      "image": "maasai-mara.jpg",
      "rating": 4.9,
      "priceRange": "$$$"
    }
  ]
}

// Field Mappings for Robust Handling:
// - id: destination.id (numeric or string)
// - name: destination.name
// - slug: destination.slug (auto-generated if empty)
// - region: destination.region
// - type: destination.type (default "safari" if missing)
// - description: destination.description
// - priceFrom: destination.priceFrom || destination.startingPrice || convertPriceRange(destination.priceRange)
// - rating: destination.rating
// - status: destination.status || "published"
// - bestTime: destination.bestTime
// - duration: destination.duration
// - highlights: destination.highlights (array of strings)
// - image: destination.image (URL)
// - gallery: destination.gallery (array of URLs)
// - tags: destination.tags (optional)
```

---


---

## Manager Destinations API

**Base Endpoint:** `/api/manager/content/destinations`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/manager/content/destinations` | List all destinations |
| GET | `?type=safari` | Filter by type |
| GET | `?status=published` | Filter by status |
| GET | `?search=maasai` | Search destinations |
| GET | `/api/manager/content/destinations/:id` | Get destination details |
| POST | `/api/manager/content/destinations` | Create destination |
| PUT | `/api/manager/content/destinations/:id` | Update destination |
| DELETE | `/api/manager/content/destinations/:id` | Delete destination |
| POST | `/api/manager/content/destinations/:id/publish` | Publish destination |
| POST | `/api/manager/content/destinations/:id/unpublish` | Unpublish destination |

**Request/Response Schemas:**

```javascript
// POST /api/manager/content/destinations
{
  "name": "Maasai Mara National Reserve",
  "slug": "maasai-mara",               // URL-friendly slug, auto-generated if empty
  "region": "Southwest Kenya",
  "type": "safari",                    // "safari" | "beach" | "mountain" | "lake" | "city"
  "description": "Famous for the Great Migration...",
  "priceFrom": 450,                    // Starting price in USD
  "rating": 4.9,                       // 0-5 scale
  "status": "published",               // "published" | "draft"
  "bestTime": "Jun-Oct",               // Best visiting months
  "duration": "long",                  // "short" | "medium" | "long"
  "highlights": ["Great Migration", "Big Five", "Hot Air Balloon"],
  "image": "https://cdn.example.com/images/dest-1.jpg",
  "gallery": ["url1", "url2"],
  "tags": ["Most Popular", "Big Five"] // optional
}

// GET /api/manager/content/destinations
// Response can be either:
// Option 1: { success: true, data: { destinations: [...], total: N, page: 1, limit: 20 } }
// Option 2: { success: true, data: [...] } (direct array)

// Mock Data Fallback: /data/destinations.json
{
  "destinations": [
    {
      "id": 1,
      "name": "Maasai Mara National Reserve",
      "slug": "maasai-mara",
      "region": "Southwest Kenya",
      "description": "Famous for Great Migration...",
      "highlights": ["Great Migration", "Big Five", "Hot Air Balloon"],
      "bestTime": "Jun-Oct",
      "duration": "long",
      "season": "jun-oct",
      "image": "maasai-mara.jpg",
      "rating": 4.9,
      "priceRange": "$$$"
    }
  ]
}

// Field Mappings for Robust Handling:
// - id: destination.id (numeric or string)
// - name: destination.name
// - slug: destination.slug (auto-generated if empty)
// - region: destination.region
// - type: destination.type (default "safari" if missing)
// - description: destination.description
// - priceFrom: destination.priceFrom || destination.startingPrice || convertPriceRange(destination.priceRange)
// - rating: destination.rating
// - status: destination.status || "published"
// - bestTime: destination.bestTime
// - duration: destination.duration
// - highlights: destination.highlights (array of strings)
// - image: destination.image (URL)
// - gallery: destination.gallery (array of URLs)
// - tags: destination.tags (optional)
```

---


## Manager Packages API

**Base Endpoint:** `/api/manager/content/packages`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/manager/content/packages | List all packages |
| GET | ?category=safari&status=published | Filter packages |
| GET | /api/manager/content/packages/:id | Get package details |
| POST | /api/manager/content/packages | Create package |
| PUT | /api/manager/content/packages/:id | Update package |
| DELETE | /api/manager/content/packages/:id | Delete package |

**Mock Data:** /data/packages.json

## Manager Blogs API

**Base Endpoint:** `/api/manager/content/blog`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/manager/content/blog | List all blogs |
| GET | ?category=guide&status=published | Filter blogs |
| GET | /api/manager/content/blog/:id | Get blog details |
| POST | /api/manager/content/blog | Create blog |
| PUT | /api/manager/content/blog/:id | Update blog |
| DELETE | /api/manager/content/blog/:id | Delete blog |

**Mock Data:** /data/blogs.json

## Manager Bookings API

**Base Endpoint:** `/api/manager/bookings`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/manager/bookings | List all bookings |
| GET | ?status=upcoming&dateFrom=2026-01-01 | Filter bookings |
| GET | /api/manager/bookings/:id | Get booking details |
| PUT | /api/manager/bookings/:id | Update booking |
| PATCH | /api/manager/bookings/:id/status | Update status |

**Query Parameters:**
- status: upcoming, confirmed, pending, completed, cancelled
- dateFrom, dateTo: Date range filter
- search: Search by guest name

**Mock Data:** Uses fallback getMockBookings() in list.html

## Manager Messages API

**Base Endpoint:** `/api/manager/messages`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/manager/messages | List all messages |
| GET | ?status=unread&type=inquiry | Filter messages |
| GET | /api/manager/messages/:id | Get message details |
| POST | /api/manager/messages/:id/reply | Reply to message |

**Query Parameters:**
- status: unread, read, archived
- type: inquiry, booking, general, support

## Manager Reviews API

**Base Endpoint:** `/api/manager/content/reviews`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/manager/content/reviews | List all reviews |
| GET | ?status=pending&rating=5 | Filter reviews |
| GET | /api/manager/content/reviews/:id | Get review details |
| PUT | /api/manager/content/reviews/:id | Update review |
| PUT | /api/manager/content/reviews/:id/approve | Approve review |
| PUT | /api/manager/content/reviews/:id/reject | Reject review |
| DELETE | /api/manager/content/reviews/:id | Delete review |

**Query Parameters:**
- status: pending, approved, rejected, flagged
- rating: 1-5 star filter

**Fallback:** Uses mockReviews() in list.html

## Public Reviews API

**Base Endpoint:** `/api/reviews`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reviews | List reviews for an item |
| GET | ?type=hotels&itemId=h123 | Get reviews for specific item |
| POST | /api/reviews | Submit new review |

**Query Parameters (GET):**
- type: hotels, tours, destinations, products, experiences
- itemId: The item's unique ID (e.g., h123, t1, dest-1)

**Request Body (POST):**
```json
{
  "type": "hotels",
  "itemId": "h123",
  "rating": 5,
  "text": "Amazing experience! Would definitely return.",
  "user": "John D."
}
```

**Response (GET):**
```json
{
  "success": true,
  "data": [
    {
      "id": "r1",
      "user": "John D.",
      "rating": 5,
      "text": "Amazing experience!",
      "date": "2026-03-15",
      "helpful": 12
    }
  ],
  "rating": {
    "average": 4.5,
    "count": 78,
    "distribution": { "1": 2, "2": 5, "3": 10, "4": 20, "5": 41 }
  }
}
```

**Response (POST):**
```json
{
  "success": true,
  "data": {
    "id": "r999",
    "user": "John D.",
    "rating": 5,
    "text": "Amazing experience!",
    "date": "2026-04-19",
    "helpful": 0
  }
}
```

**Frontend Usage:**
```javascript
// Get reviews for dynamically fetched hotel
MutsReviewsService.getReviewsForItem('hotels', hotelId).then(reviews => {
    if (reviews.length > 0) {
        // Show reviews section
        MutsReviewsWidget.init({
            itemType: 'hotels',
            itemId: hotelId,
            containerId: 'reviews-widget'
        });
    }
});
```

### Booking Verification (Required)
Only users who have **recently attended** (within last 90 days) can submit reviews.

**Frontend check - Recent Attendance:**
```javascript
const RECENT_DAYS = 90;

async function canUserReview(itemType, itemId) {
    if (!window.MutsAuth || !window.MutsAuth.getSession()) {
        return { canReview: false, reason: 'login' };
    }
    
    // Get user's recent completed bookings
    const bookings = await MutsBookingsService.getByFilter({
        status: 'completed',
        itemType: itemType,
        itemId: itemId
    });
    
    if (bookings.length === 0) {
        return { canReview: false, reason: 'noBooking' };
    }
    
    // Check if attendance was recent (within 90 days)
    const recentCutoff = new Date();
    recentCutoff.setDate(recentCutoff.getDate() - RECENT_DAYS);
    
    const recentBooking = bookings.find(b => new Date(b.endDate) >= recentCutoff);
    
    if (!recentBooking) {
        return { canReview: false, reason: 'notRecent' };
    }
    
    return { canReview: true, booking: recentBooking };
}

// Usage
canUserReview('hotels', 'h123').then(result => {
    if (result.canReview) {
        // Show "Write a Review" button
    } else if (result.reason === 'login') {
        // Show "Login to review"
    } else {
        // Show "Only guests who attended recently can review"
        // But still show existing reviews (read-only)
    }
});
```

**For Dynamic Items (all visitors can view):**
```javascript
// Any user can VIEW reviews
MutsReviewsService.getReviewsForItem('hotels', 'h123').then(reviews => {
    // Always display reviews (read-only)
    displayReviews(reviews);
});

// Only recent guests can WRITE reviews
canUserReview('hotels', 'h123').then(result => {
    if (result.canReview) {
        showReviewForm();
    }
});
```

**Notes:**
- Reviews are linked to items by type + itemId (not item UUID)
- Manager moderates via `/api/manager/content/reviews`
- Frontend checks `MutsAPIConfig.isConnected()` to decide mock vs API

---

## API Testing - curl Examples

### Destinations (Public)

```bash
# Get all destinations
curl -X GET http://localhost:3000/api/destinations

# Get popular destinations
curl -X GET "http://localhost:3000/api/destinations?popular=true"

# Filter by type
curl -X GET "http://localhost:3000/api/destinations?type=safari"

# Search destinations
curl -X GET "http://localhost:3000/api/destinations?search=maasai"
```

### Manager Destinations (Authenticated)

```bash
# Manager login
curl -X POST http://localhost:3000/api/manager/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mutssafaris.com","password":"securepassword"}'

# Get all destinations (with token)
curl -X GET http://localhost:3000/api/manager/content/destinations \
  -H "Authorization: Bearer <token>"

# Create destination
curl -X POST http://localhost:3000/api/manager/content/destinations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Serengeti",
    "slug":"serengeti",
    "region":"Northern Tanzania",
    "type":"safari",
    "description":"Vast plains...",
    "priceFrom":450,
    "rating":4.9,
    "status":"published"
  }'

# Update destination
curl -X PUT http://localhost:3000/api/manager/content/destinations/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"priceFrom":500}'

# Delete destination
curl -X DELETE http://localhost:3000/api/manager/content/destinations/1 \
  -H "Authorization: Bearer <token>"

# Publish destination
curl -X POST http://localhost:3000/api/manager/content/destinations/1/publish \
  -H "Authorization: Bearer <token>"
```

### Error Response Format

```json
{
  "success": false,
  "error": "Destination not found",
  "code": "NOT_FOUND"
}
```

---

*Documentation Updated: 2026-04-17*
