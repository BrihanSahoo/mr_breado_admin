# Business Outlets crash fix

Fixed the `/business-outlets` route so it does not crash when MongoDB returns structured address objects or when a legacy dashboard endpoint is unavailable.

Changes:
- Structured addresses are converted to readable strings before rendering.
- React no longer receives raw objects as text children.
- Outlet list supports `/admin/outlets`, `/admin/restaurants`, and the primary-outlet compatibility route.
- Dashboard metrics gracefully fall back to the outlet list when the historical dashboard endpoint is missing.
- Outlet detail dashboard tries `full-dashboard`, `dashboard`, then outlet detail.
- API failures render an inline retry state instead of the global TanStack error page.
- Client and SSR production builds pass.
