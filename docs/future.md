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

- [ ] Rich text editor for blog posts
- [ ] Media library with drag-drop upload
- [ ] SEO meta tags management
- [ ] Multi-language support (Swahili)
- [ ] Content scheduling/publishing workflow

## Phase 3: User Features

- [ ] Social login (Google, Facebook)
- [ ] User reviews and ratings
- [ ] Wishlists sync across devices
- [ ] Booking modifications
- [ ] Loyalty points dashboard
- [ ] Referral program

## Phase 4: Performance

- [ ] Image optimization/CDN
- [ ] Service worker for offline
- [ ] Lazy loading implementation
- [ ] API response caching
- [ ] Bundle optimization

---

## Technical Debt

### Completed ✅ (2026-04-17)
- [x] Replace remaining eval() calls - js/booking-management.js
- [x] Add input validation libraries - js/validation.js
- [x] Implement Rate limiting - js/rate-limiter.js
- [x] Add API request logging - js/api-logger.js
- [x] Browser compatibility check - js/browser-check.js
- [x] Accessibility audit - docs/accessibility.md
- [x] Refactor services to ES6 modules - js/services/index.js

### High Priority (Pending)
- [ ] Add unit tests
- [ ] PWA manifest (offline support)

### Medium Priority (Pending)
- [ ] TypeScript migration consideration
- [ ] Full accessibility compliance (WCAG 2.1 AA)

### Low Priority (Pending)
- [ ] Code comments cleanup --done incrementally over time
- [ ] Accessibility audit --completed baseline, ongoing fixes
- [ ] Deprecated browser support --browser-check.js added

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

*Last Updated: 2026-04-17*
*Completed: eval() removal, validation lib, rate limiter, API logger, browser check, accessibility docs, ES6 modules*