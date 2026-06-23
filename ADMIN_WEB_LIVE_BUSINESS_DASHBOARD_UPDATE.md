# Mr. Breado Admin Web – live dashboard and responsive update

## Implemented

- Global React Query defaults now refresh on reconnect and focus, avoid retry loops for 4xx business errors, and keep live data cached briefly.
- Main dashboard refreshes every 15 seconds from the backend.
- Dashboard service enriches backend metrics with real order, outlet, customer, rider, payment, and product records when aggregate fields are missing.
- Revenue chart now uses backend order history grouped by business date rather than one bar per recently loaded row.
- Revenue analytics separates total, online, and COD values.
- Order status analytics recognizes RECEIVED and PENDING_PAYMENT as pending work.
- Low-stock product count is derived from current backend inventory data.
- Dashboard displays a live-backend indicator and the latest generated timestamp.
- Dashboard buttons and report controls are responsive and touch-safe on small screens.
- Existing mobile sidebar, scrollable dialogs, touch targets, haptic feedback, order actions, invoices, outlet dashboards, daily reports, payments, products, categories, brands, cuisines, riders, and notifications are preserved.

## Validation

- npm ci: passed
- Vite client production build: passed
- Nitro/Vercel SSR production build: passed
