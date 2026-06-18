# Admin Web Real Data Fix

This patch fixes admin web pages showing `0` or empty data even when backend has real records.

## Fixed

- `src/api/client.ts`
  - Supports both Spring-style `{ success, message, data }` responses and Node-style `{ success, message, orders/users/restaurants/... }` responses.
  - Normalizes `orders`, `users`, `customers`, `restaurants`, `drivers`, `products`, `categories`, `banners`, `offers`, `transactions`, `stories`, etc. into `items`.
  - Adds compatible `total`, `total_pages`, `per_page`, `page` aliases for all admin tables.

- `src/services/orders.service.ts`
  - Fixed Vite/esbuild error: cannot mix `??` and `||` without parentheses.
  - Handles nested order response objects such as `{ order: {...} }`.

- `src/services/dashboard.service.ts`
  - If `/admin/dashboard` returns empty/zero DTO, dashboard now computes visible counters from real orders/users/customers/restaurants/drivers list endpoints.

## Build verified

`npm run build` completed successfully.
