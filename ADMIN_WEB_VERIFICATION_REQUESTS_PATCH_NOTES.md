# Admin Web Verification Requests Patch

Implemented fixes:

- Added a clear **Verification Requests** sidebar section.
- Service Area & Verification page now shows:
  - Delivery service range controls.
  - Restaurant verification requests.
  - Rider/driver verification requests.
  - Pending/restaurant/rider counts.
  - View Details modal with submitted fields and document links.
  - Approve / Reject actions connected to backend endpoints with fallbacks.
- Delivery Boys page:
  - Replaced small eye icon with a visible **View** button.
  - Added larger **Cash Settlement** button.
  - Added driver details modal.
  - Added verify / mark-unverified controls.
  - Displays verified/unverified based on `verificationStatus` first, then legacy `verified` fallback.
- Restaurants page:
  - Replaced small eye icon with a visible **View** button.
  - Added restaurant details modal.
  - Added verify / mark-unverified controls.
  - Displays verification status from backend.
- Build verified with `npm run build`.

Backend endpoints used:

- `GET /admin/service-area`
- `PUT /admin/service-area`
- `GET /admin/verifications`
- `POST /admin/verifications/{id}/approve`
- `POST /admin/verifications/{id}/reject`
- `GET /admin/restaurants/join-requests`
- `POST /admin/restaurants/join-requests/{id}/approve`
- `POST /admin/restaurants/join-requests/{id}/reject`
- `PATCH /admin/verifications/restaurants/{id}/status`
- `GET /admin/drivers/verification-requests`
- `POST /admin/drivers/{id}/approve`
- `POST /admin/drivers/{id}/reject`
- `PATCH /admin/verifications/riders/{id}/status`
- `GET /admin/drivers/cash`
- `POST /admin/drivers/{driverId}/cash-deposit/verify`
