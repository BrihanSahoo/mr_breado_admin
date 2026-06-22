# Mr. Breado Admin Web — Live Data, Responsive UI and Backend Action Alignment

## Implemented

- Added live order refresh every 10 seconds and refetch on browser focus.
- Added live selected-outlet, outlet dashboard and outlet-list refresh.
- Added selected-outlet API compatibility across current and legacy backend aliases.
- Added fallback routes for admin order accept, preparing, ready, cancel and reject actions.
- Added invoice/receipt download fallbacks for active and completed orders.
- Added invoice-send route compatibility.
- Preserved backend error messages on contextual actions instead of replacing every error with a generic toast.
- Improved mobile/tablet dialogs, touch sizes, horizontal overflow handling and responsive action grids.
- Increased touch haptic pulse on compatible mobile browsers.
- Kept authorization and business data backend-driven; no new static business records were introduced.

## Validation

- `npm ci` completed.
- Vite client production build completed successfully.
- Vite SSR production bundle completed successfully.
- The source contained pre-existing strict TypeScript diagnostic issues in unrelated legacy screens; Vite production compilation is successful because those diagnostics are not runtime build blockers. These diagnostics were not hidden by changing compiler strictness.

## Deployment

Set `VITE_API_BASE_URL` to the deployed backend `/api` URL and deploy the complete web folder.
