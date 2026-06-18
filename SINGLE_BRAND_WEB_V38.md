# Admin Web v38 Single Brand Multi Outlet Notes

This web build should be used with backend v38.

Core UI behavior:
- Restaurants page now represents Mr Breado Outlets/Branches.
- Dashboard reads head-office outlet analytics.
- Delivery Boys page reads `/admin/delivery-boys` and shows assigned outlet data when present.
- Franchise marketplace direction should be removed from business flow; use Outlet Management instead.

Backend endpoints used:
- `/admin/head-office/dashboard`
- `/admin/outlets`
- `/admin/delivery-boys`
- `/admin/reports/outlet-sales`
