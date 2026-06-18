# Admin Web Verification Fix v15

- Deduplicates verification requests by request id, stopping repeated rows from multiple endpoint aliases.
- Reads real submitted verification payload fields from backend: mobile, Aadhaar, driving license, vehicle RC, address, GST, PAN, FSSAI.
- Approve/reject now first uses the canonical v12/v15 request endpoint: /admin/verifications/:id/approve or /reject.
- Document links use backend-provided view/download URLs.
- Build tested with npm run build.
