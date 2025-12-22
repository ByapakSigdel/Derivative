# Environment

Required:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Optional:
- `ALLOWED_USER_IDS` — comma-separated allowlist of IDs/emails (restricts Supabase-authenticated access)
- `ALLOWED_USER_ID`, `ALLOWED_USER_PASSWORD` — single allowed pair
- `BACKDOOR_ID`, `BACKDOOR_PASSWORD` — dev backdoor (defaults to `admin/admin`)
- `SESSION_SECRET` — HMAC secret for issuing session cookie (defaults to `dev-secret`)

Notes:
- Registration is disabled; login must use ID/password provided by you.
- The backdoor is for development convenience only.
