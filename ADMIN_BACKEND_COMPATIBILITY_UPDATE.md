# Admin Dashboard Compatibility Update

Target backend: `mr_breado_node_backend_v62_principal_fixed`

## Canonical calls now used

| Function          | Method | Endpoint                                            |
| ----------------- | -----: | --------------------------------------------------- |
| Admin login       |   POST | `/api/admin/login`                                  |
| Accept order      |  PATCH | `/api/orders/:id/status` with `ACCEPTED`            |
| Start preparation |  PATCH | `/api/orders/:id/status` with `PREPARING`           |
| Mark ready        |  PATCH | `/api/orders/:id/status` with `READY`               |
| Reject order      |  PATCH | `/api/orders/:id/status` with `REJECTED` and reason |

All order transitions include an `Idempotency-Key` header.

## Deployment rule

The admin dashboard no longer invokes any `ensure-schema` endpoint. Apply backend migrations using the backend deployment command before deploying the web dashboard.

## Compatibility retained

- Existing response envelope normalization remains enabled.
- Snake-case and camel-case fields are both handled.
- Existing invoice, reporting, outlet, transaction and settings endpoint paths remain unchanged.
- Legacy backend endpoint declarations remain in the frontend constants for compatibility, but new order actions use the canonical lifecycle endpoint.
