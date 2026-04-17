# AGENTS.md - Muts Safaris

## Project Type
Static HTML/CSS/JS website - no build system, no package.json. Pure vanilla JavaScript with mock data services.

## Dev Server
```bash
python3 -m http.server 8080
# or
npx serve -p 8080
```

## Architecture
- **Entry**: `index.html` - Routes to `login.html` or `pages/dashboard/index.html` based on `MutsAuth.getSession()`
- **Services**: Exposed on `window.*` (e.g., `MutsHotelsService`, `MutsBookingsService`)
- **Mock data**: All services fall back to JSON in `/data/` folder
- **API mode**: `MutsAPIConfig.configure({ enableAll: true })` connects to live API
- **API base**: `http://localhost:3000/api` (dev)
- **Manager API**: `http://localhost:3000/api/manager`

## Services (`window.*`)
| Service | Data File |
|---------|-----------|
| MutsHotelsService | data/hotels.json |
| MutsBookingsService | data/bookings.json |
| MutsDestinationsService | data/destinations.json |
| MutsListingsService | data/listings.json |
| MutsTransactionsService | data/transactions.json |
| MutsMessagesService | data/messages.json |
| MutsToursService | data/tours.json |
| MutsLoyaltyService | data/loyalty.json |

## Key Files
- `index.html` - Entry routing (SPA-like via hash)
- `js/api-config.js` - API environment switching (auto-detects localhost/staging/production)
- `js/auth.js` - User authentication, session storage
- `pages/dashboard/` - Protected manager dashboard pages

## API Response Format
```json
{ "success": true, "data": {...}, "message": "..." }
```

## Environment Keys
- `muts-safaris-theme` - Theme (light/dark)
- `muts_user_session` - User session JWT
- `muts_manager_session` - Manager session JWT (separate from user)

## Gotchas
- **Service methods vary** - Some expected methods like `getBeachByName` may not exist; check service file first
- Manager dashboard uses `/api/manager/auth/login` (separate auth endpoint)
- Services have `fetchFromAPI()` but no explicit `getByName` - filter with `getByFilter()` instead
- Images use CDN: `https://images.mutssafaris.com`

## Reference Docs
- `API_SPECIFICATION.md` - Full endpoint reference
- `FRONTEND_INTEGRATION.md` - Integration notes and error tracking
- `IMPLEMENTATION_PLAN.md` - Feature phases