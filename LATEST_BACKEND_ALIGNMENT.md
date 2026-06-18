# Latest Backend Alignment

This admin dashboard is aligned with `mr_breado_node_backend_v62_principal_fixed`.

## Changes

- Admin login now uses the explicit `/api/admin/login` endpoint.
- Order state changes use the canonical `PATCH /api/orders/:id/status` endpoint.
- Every order transition sends an `Idempotency-Key` header and body fallback.
- Legacy order action endpoints remain defined only for compatibility; new UI actions use the canonical lifecycle endpoint.
- The dashboard no longer calls runtime database/schema preparation endpoints.
- Database migrations must be executed during backend deployment using `npm run migrate`.
- Bearer authentication remains attached to all protected requests.
- Existing response normalization for legacy snake_case and Node/Spring envelopes is preserved.

## Backend requirements

- Set `VITE_API_BASE_URL` to the deployed backend API root, including `/api`.
- Apply backend migrations before deploying this dashboard.
- Admin users must receive a JWT with role `ADMIN`.
