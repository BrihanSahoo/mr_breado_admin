# Admin login/session fix

- Backend base URL is fixed to `https://mr-breado-new-backend.onrender.com/api`.
- Login requests no longer trigger the global session-expired handler.
- A stale token is cleared before a new login attempt.
- HTTP 401 from login now displays `Invalid admin email or password.`
- Authenticated 401 responses elsewhere still clear the session and redirect to login.
