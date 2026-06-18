# Outlet Product Catalog Fix

## Problem

The Mr Breado Store page loaded the admin-created foods, but the outlet inventory modal depended only on `GET /admin/outlets/:id/available-products`. Historical backend versions can return different response shapes, or the outlet inventory query can fail while the central catalog still works. The UI interpreted those cases as an empty catalog.

## Fix

The outlet inventory loader now requests both:

- `GET /admin/outlets/:id/available-products`
- `GET /admin/products/catalog`

The results are normalized across `all`, `items`, `products`, `foods`, and direct-array response formats. Outlet-assigned stock is merged with the central catalog. If the outlet inventory request fails but the catalog works, the products still appear and can be assigned to the outlet.

The modal now also distinguishes a real request error from a genuinely empty catalog.

## Save flow

Selected items are saved through the existing compatible endpoint:

`POST /admin/outlets/:id/stock`

No existing endpoint was removed or renamed.
