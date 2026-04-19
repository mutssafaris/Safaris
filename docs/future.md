# Future Enhancements - Muts Safaris

## Roadmap

This document tracks planned features and improvements for the Muts Safaris platform.

---

## Phase 1: Backend Integration

- [ ] Implement actual backend API (Kotlin/Spring Boot)
- [ ] Database integration (PostgreSQL)
- [ ] User authentication with OAuth2
- [ ] Booking payment integration (Flutterwave)
- [ ] Email notifications system

## Phase 2: Content Management

- [x] Rich text editor for blog posts - js/muts-editor.js (WYSIWYG with toolbar)
- [x] Media library with drag-drop upload - js/media-library.js
- [x] SEO meta tags management - js/seo-manager.js (title, description, keywords)
- [x] Multi-language support (Swahili) - js/i18n.js, js/lang-switcher.js
- [ ] Content scheduling/publishing workflow

## Phase 3: User Features

- [x] Social login (Google, Facebook)
- [x] User reviews and ratings - js/reviews-widget.js + existing reviews-service.js (backend-ready)
- [ ] Wishlists sync across devices
- [ ] Booking modifications
- [x] Loyalty points dashboard - pages/dashboard/loyalty.html (full UI with redeem, history)
- [x] Referral program - apply code UI, 500pts bonus, generate code, referredBy tracking

## Phase 4: Performance

- [x] Image optimization/CDN
- [x] Service worker for offline - js/sw.js
- [x] Lazy loading implementation
- [x] API response caching - js/cache.js
- [x] Bundle optimization

---

## Technical Debt

### Completed ✅ (2026-04-19)
- [x] Trusters section on About page - sciFi HUD themed cards with logoType (CSS-generated logos, no base64)
- [x] Service worker fix - js/sw.js (proper Response creation, error handling)
- [x] PWA manifest icon fix - manifest.json (uses existing favicon.ico)
- [x] Remove Google Fonts - all CSS files now use system font fallbacks (Courier New)
- [x] Critical inline CSS - dashboard shows loading spinner immediately
- [x] Desktop layout fix - removed centering/overflow issues, blank spaces on sides
- [x] Sidebar gradient - matches main content purple/pink sci-fi gradient
- [x] Social login UI - login.html (Google, Apple buttons)
- [x] Social login handler - MutsAuth.socialLogin(provider, idToken) in js/auth.js
- [x] Social login documentation - docs/FRONTEND_INTEGRATION.md (backend endpoints, schemas)
- [x] Navigation guard - js/nav-guard.js protects all dashboard pages except contact
- [x] Protected nav links - login.html (Home, Explore, My Trips, Blog require auth; Contact stays open)
- [x] Contact page update - more general inquiry text, compact contact cards
- [x] Contact form options - added General Inquiry, Partnership, Media, Support subjects
- [x] Mock data indicator - js/mock-indicator.js shows subtle "Demo" badge when using mock data
- [x] Mock indicator CSS - css/mock-indicator.css with pulsing dot animation
- [x] Booking detail page UI - added missing CSS styles for booking-detail-header, booking-detail-grid, timeline, cards
- [x] Booking action buttons - custom HUD-styled buttons with gold/red theming (28px icons)
- [x] Loyalty dashboard enhancements - redeem section, apply referral code, referredBy tracking, referral count display
- [x] Referral program - signup integration, generate code, track referredBy, prevent self-referral
- [x] Image auto-conversion - js/image-auto-convert.js converts data-image-key to picture/WebP elements
- [ ] HUD hover effects - add sci-fi sweep animation, glow, lift on booking action buttons (TBD)

### Completed ✅ (2026-04-18)
- [x] Replace remaining eval() calls - js/booking-management.js
- [x] Add input validation libraries - js/validation.js
- [x] Implement Rate limiting - js/rate-limiter.js
- [x] Add API request logging - js/api-logger.js
- [x] Browser compatibility check - js/browser-check.js
- [x] Accessibility audit - docs/accessibility.md
- [x] Refactor services to ES6 modules - js/services/index.js
- [x] Accessibility utilities library - js/a11y.js (skip links, focus trap, aria-live)
- [x] Focus-visible CSS styles - css/themes.css
- [x] Form error announcements - login.html (aria-live, error containers)
- [x] Modal focus trapping - login.html auth modal
- [x] Icon button ARIA labels - js/a11y.js auto-labelling
- [x] PWA manifest fix - manifest.json (icon sizes)
- [x] Image optimization library - js/image-optimizer.js (srcset, WebP, lazy load)
- [x] Picture elements in tours.html - lazy loading & decoding
- [x] Picture elements in hotels.html - lazy loading & decoding
- [x] Picture elements in experiences.html - lazy loading & decoding
- [x] Picture elements in gallery.js - reverted (WebP files don't exist)
- [x] Hero image optimization - login.html (fetchpriority)
- [x] Responsive image CSS - css/dashboard-theme.css
- Note: WebP requires actual .webp image files to exist on server
- [x] Picture elements in experiences.html - WebP with fallback
- [x] Picture elements in gallery.js - WebP with fallback
- [x] Dashboard init improvements - js/init-dashboard.js (auto-load a18n)
- [x] i18n sidebar integration - js/dashboard-theme.js (data-i18n on nav labels)
- [x] i18n existing nav labels - translateExistingNavLabels() function
- [x] i18n language change handler - re-translates nav on language switch


### Completed ✅ (2026-04-17)
- [x] Service worker for offline - js/sw.js, js/sw-register.js
- [x] API response caching - js/cache.js
- [x] Lazy loading implementation - Partial (init-dashboard.js pattern)
- [x] Bundle optimization - N/A (static site)


### Medium Priority (Pending)
- [ ] TypeScript migration (analyzed, not recommended at this time)
- [ ] Full accessibility compliance (WCAG 2.1 AA) - heading hierarchy audit pending

### Low Priority (Pending)
- [ ] Code comments cleanup --done incrementally over time
- [ ] Deprecated browser support --browser-check.js added
- [ ] Hotel pages reviews migration - migrate 19 hotel detail pages from static HTML to unified reviews-widget.js
  - See docs/reviews-migration-plan.md for detailed steps
  - Hotelfiles: eco-budget (6), luxury (7), mid-range (6) need widget integration
- [ ] Backend reviews API - implement /api/reviews endpoints (see .kilo/plans/reviews-api-plan.md)

---

## Feature Ideas

### User Dashboard
- Interactive trip planner with drag-drop
- Weather widget for destinations
- Live chat with AI assistant
- AR preview for hotels

### Manager Dashboard
- Analytics with charts
- Revenue predictions
- Content performance metrics
- Automated reports (email)

### Booking Flow
- Deposit payments
- Installment plans
- Travel insurance add-on
- Group booking discounts

---

## Contributors

- Lead Developer: Mutsafaris Team
- Design: Safari aesthetic team
- Testing: QA team

---

*Last Updated: 2026-04-19*
*Completed: Trusters section, service worker fix, PWA manifest, Google Fonts removal, critical CSS, desktop layout, sidebar gradient*