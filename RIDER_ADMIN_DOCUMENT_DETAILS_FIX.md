# Rider details and documents UI fix

- Uses `driverId`, `mongoId`, `userId`, `profileId` or `_id` as a stable rider identifier.
- Loads `/admin/drivers/:id` first because it returns the complete rider-control model.
- Uses the verification-details endpoint only as a compatibility fallback.
- Normalizes phone, email, status and Cloudinary document URL aliases.
- Approve, payout, COD and UPI actions use the same stable rider reference.
