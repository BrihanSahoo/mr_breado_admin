# v46 Inline Outlet Dashboard Fix

This patch fixes the admin Business Outlets page issue where clicking **Full Dashboard** changed the URL or did nothing visually but continued showing the outlet grid.

## Fix
- Full Dashboard now renders the Outlet Command Center directly inside the same section using React state.
- No route matching is required for the first click.
- Back to Outlets returns to the grid without relying on TanStack dynamic routes.
- Outlet dashboard page includes business-focused cards for:
  - manager/control details
  - total, online, offline, COD sales
  - today/week/month/year sales placeholders from backend summary
  - stock items, low stock, available products, stock value
  - best-selling foods
  - slow-selling foods
  - daily closing ledger
  - current stock and stock update
  - recent stock movement/activity

## Build note
I attempted `npm run build`, but the extracted sandbox did not have Vite/node_modules installed, so build could not run here (`vite: not found`).
