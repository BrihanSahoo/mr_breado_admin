# Mr Breado Admin Web Real Backend Data Fix v14

This build removes the dashboard zero-count bug caused by the v12 backend returning:

```json
{ "users": 10, "orders": 20, "revenue": 1000, "restaurants": 5, "products": 30 }
```

while the older admin dashboard expected:

```json
{ "totalUsers": 10, "totalOrders": 20, "totalRevenue": 1000 }
```

## Fixed

- Dashboard counters now map the real v12 backend fields correctly.
- Dashboard also aggregates missing counters from real admin endpoints:
  - `/api/admin/orders`
  - `/api/admin/users`
  - `/api/admin/restaurants`
  - `/api/admin/drivers`
  - `/api/admin/online-transactions`
- Delivery Boys page now uses `/api/admin/drivers` instead of `/api/admin/drivers/cash`.
- Products default admin pages use `/api/admin/products`.
- The `??` + `||` TypeScript build error remains fixed.

## Not touched

- Razorpay create-order logic is not changed.
- Backend payment routes are not changed.
