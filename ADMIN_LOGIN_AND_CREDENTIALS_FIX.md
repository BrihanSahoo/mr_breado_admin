# Admin login and credential management fix

## Login endpoint compatibility
The web app now tries these paths in order:

1. `POST /api/admin/login`
2. `POST /api/auth/login`
3. `POST /api/admin/auth/login`

The backend base URL comes from `VITE_API_BASE_URL` and must include `/api` exactly once.

## Admin account management
The Admin Profile page supports changing the admin email and password with current-password verification. It also keeps optional OTP fields for backends where OTP verification is enabled.

Supported email aliases:
- `PUT /api/admin/account/email`
- `PUT /api/admin/profile/email`
- `PUT /api/admin/change-email`

Supported password aliases:
- `PUT /api/admin/account/password`
- `PUT /api/admin/profile/password`
- `PUT /api/admin/change-password`

After a successful email or password change, the web app clears the token and redirects to login.

## Required environment

```env
VITE_API_BASE_URL=https://YOUR-RENDER-SERVICE.onrender.com/api
```
