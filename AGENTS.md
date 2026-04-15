# AGENTS.md - Muts Safaris

## Project Type
Static HTML/CSS/JS website - no build system, no package.json. Pure vanilla JavaScript with mock data services.

## Dev Server
```bash
# Serve from project root on port 8080
python3 -m http.server 8080
# or
npx serve -p 8080
```

## Architecture
- **Frontend**: Vanilla JS with service layer pattern
- **Mock data**: All services default to mock JSON data in `/data/` folder
- **API mode**: Services fall back to mock data if API unavailable; toggle via `MutsAPIConfig.configure({ enableAll: true })`
- **API base**: `http://localhost:3000/api` (dev)
- **Manager API**: `http://localhost:3000/api/manager`

## Services (window.*)
| Service | Data File |
|---------|-----------|
| MutsHotelsService | data/hotels.json |
| MutsBookingsService | data/bookings.json |
| MutsDestinationsService | data/destinations.json |
| MutsListingsService | data/listings.json |
| MutsAfricasaService | data/africasa.json |
| MutsMessagesService | data/messages.json |
| MutsTransactionsService | data/transactions.json |

## Key Files
- `index.html` - Entry point (SPA-like routing via hash)
- `js/api-config.js` - API configuration and environment switching
- `js/auth.js` - User authentication
- `pages/dashboard/` - Protected dashboard pages
- `css/` - Stylesheets

## Environment Keys
- `muts-safaris-theme` - Theme preference (light/dark)
- `muts_user_session` - User session JWT
- `muts_manager_session` - Manager session JWT (separate)

## Gotchas
- Service methods like `getBeachByName` may not exist; check the service file first
- API endpoints return `{ success: true/false, data: {...}, message: "..." }` format
- Manager dashboard uses separate auth endpoint: `/api/manager/auth/login`

## Reference Docs
- `API_SPECIFICATION.md` - Full API endpoint reference
- `IMPLEMENTATION_PLAN.md` - Feature phases 9-14 (completed)
- `FRONTEND_INTEGRATION.md` - Integration notes and errors
