# Repository Guidelines

## Project Structure & Module Organization
This is a static PWA built with vanilla JavaScript, HTML5, and CSS3. The application follows a service-oriented architecture where business logic is encapsulated in "services" found in `./js/services/`.
- **Global Services**: Services are exposed on the `window` object (e.g., `window.MutsHotelsService`).
- **Data Layer**: Services use a mock-first approach, falling back to JSON files in `./data/` if the API is disabled.
- **API Mode**: Managed via `MutsAPIConfig.configure({ enableAll: true })` in `./js/api-config.js`.
- **Routing**: `index.html` handles entry routing to `login.html` or `./pages/dashboard/` based on `MutsAuth` sessions.

## Build, Test, and Development Commands
The project is a static site and does not require a build step.
- **Development Server**: `python3 -m http.server 8080` or `npx serve -p 8080`.
- **Running Tests**: Append `?test=true` to the URL or execute `window.runTests()` in the browser console.

## Coding Style & Naming Conventions
- **JavaScript**: Use ES5-compatible syntax (prefer `var`) and `'use strict'`.
- **Naming**: Use PascalCase for service names (e.g., `MutsAuth`) and camelCase for methods.
- **State**: Persistent data uses localStorage keys: `muts-safaris-theme`, `muts_user_session`, and `muts_manager_session`.

## Testing Guidelines
- **Framework**: Custom unit test runner implemented in `./js/tests.js`.
- **Verification**: Tests must be run in the browser to validate `window`-scoped services and utilities (Validation, Cache, RateLimiter).

## Commit & Pull Request Guidelines
Follow the existing pattern of descriptive, concise commit messages:
- `UI fix`: Visual adjustments.
- `mtheme X.X`: Theme version updates.
- `Performance and UI fixes`: Grouped optimizations.

## Gotchas
- **Service Consistency**: Method availability varies by service; verify signatures in `./js/services/` before use.
- **Auth Endpoints**: Manager dashboard uses a separate auth endpoint (`/api/manager/auth/login`).
- **Assets**: Images are served via CDN: `https://images.mutssafaris.com`.
