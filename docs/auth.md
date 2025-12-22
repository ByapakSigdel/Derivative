# Auth

## Flow
- Login form posts `{ id, password }` to `/api/auth/login`.
- Server checks backdoor first, then env pair, then Supabase password auth.
- On success, sets an HTTP-only cookie (`session`).
- Edge middleware checks cookie presence; protected layout verifies server-side.

## Backdoor
- Defaults to `admin/admin` (configurable via env).
- Useful during local development and early integration.

## Registration
- Disabled by design.
- Register page redirects to `/login`.
- API returns 405.
