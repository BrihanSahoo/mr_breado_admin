# Admin Web Payment & Takeaway Settings Patch

## Added

The admin Settings page now has a backend-connected **Payment & Takeaway** tab.

Admin can now manage from web:

- Cash on Delivery enable / disable
- Online Payment enable / disable
- Razorpay mode: TEST / LIVE
- Razorpay Key ID
- Razorpay Secret Key
- Mr Breado Takeaway enable / disable
- Takeaway booking fee percentage
- Customer delivery charge per KM
- Minimum customer delivery charge
- Maximum customer delivery charge
- Rider delivery pay per KM
- Minimum rider delivery pay
- Support email / phone
- Business address and coordinates

## Backend endpoints used

- GET `/platform/admin/settings`
- PUT `/platform/admin/settings`
- GET `/platform/settings`

## Safety behavior

- Secret key is never shown after saving.
- Leaving the secret input blank keeps the already configured secret.
- Online payment cannot be saved unless Razorpay Key ID and Secret are configured.
- Takeaway cannot be enabled unless online payment is enabled.
- At least one payment method must remain enabled.

## Build verification

`npm run build` passed successfully.
