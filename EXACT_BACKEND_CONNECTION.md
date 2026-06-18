# Exact Backend Connection

This Admin Web is preconfigured to call:

```text
https://mr-breado-new-backend.onrender.com/api
```

The URL is built into `src/api/endpoints.ts` and is also present in `.env`, `.env.development`, and `.env.production`. No local backend configuration is required.

## Production deployment

Build command:

```bash
npm ci && npm run build
```

The deployed web application will use the Render backend above.
