# Admin Web Orders Compatibility Fix

This patch fixes the All Orders page after the v12 backend upgrade.

## Fixed
- Admin orders service now supports both `/admin/mr-breado/orders` and `/admin/orders`.
- Supports backend responses as raw arrays, `{ items }`, `{ content }`, `{ orders }`, or paginated Spring/Node envelopes.
- Normalizes snake_case/camelCase order fields for customer, payment, status, totals and items.
- Prevents the orders screen from showing “temporarily unavailable” only because the backend response shape is different.

## Not changed
- Razorpay order creation is not touched.
