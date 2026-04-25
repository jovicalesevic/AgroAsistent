# Release Notes

## 2026-04-25

### Clerk-only authentication cleanup

- Removed legacy local auth backend (`/api/auth` routes, `authController`, `User` model).
- Removed JWT-based dependencies from backend and aligned server bootstrap to Clerk middleware flow.
- Updated legacy static `public/` UI to show a clear notice that Clerk sign-in is handled by the React app.
- Cleaned project documentation by removing `JWT_SECRET` from setup instructions and documenting legacy `public/` scope.

### Verification

- Backend health check: `GET /api/health` returns `ok`.
- Protected endpoint behavior: `GET /api/beleske` without auth returns `401`.
- Frontend production build (`client`): successful `vite build`.
