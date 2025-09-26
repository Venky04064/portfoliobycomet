# 🚀 Portfolio by Comet

Advanced full-stack portfolio with unified production logic, Neon Postgres, secure auth, and rich admin/user dashboards.

## What's New (September 2025)
- Full database migration to Neon (serverless Postgres) with Prisma migrations and connection pooling
- Unified production logic for API, media, and analytics across environments
- Admin and User dashboards with granular permissions and hard controls
- Hardened settings and restrictions (rate limits, file quotas, IP logging)
- Turn‑key Vercel deployment with required environment variables

---

## Architecture Overview
- Frontend: Next.js (App Router), Tailwind, Framer Motion, Three.js
- Backend: Next.js API routes + FastAPI (optional services) behind /api
- Database: Neon Postgres (serverless, branching, pooling)
- ORM: Prisma
- Auth: JWT (HS256) + session cookies with access code gate
- Storage: File system for static assets + DB for metadata and settings
- Analytics: DB event logs + lightweight in-memory cache for hot paths

---

## Database Migration to Neon

### 1) Create Neon project
- Sign up at https://neon.tech and create a Postgres project
- Note the connection string (including ?sslmode=require)
- Create a primary branch (e.g., main) and optional preview branches per environment

### 2) Prisma setup
- Install Prisma and generate client
  - npm i -D prisma
  - npx prisma init
- Set DATABASE_URL in .env (see Environment Variables)
- Write Prisma schema (example tables):
  - users: id, email, role (admin|user), hashed_password, created_at
  - access_codes: code, is_active, expires_at, updated_at
  - themes: id, key, name, group, is_active, updated_by
  - media_assets: id, path, type, bytes, checksum, is_enabled, owner_id
  - analytics_events: id, ip, ua, route, referrer, latency_ms, created_at
  - feedback: id, rating, comment, created_at, user_id

### 3) Run migrations
- npx prisma migrate dev --name init
- For production on Vercel: npx prisma migrate deploy
- Seed data (optional): npx prisma db seed

### 4) Pooling and performance
- Use Neon pooled connection URL for serverless functions
- Enable Prisma accelerate or Data Proxy if needed for high concurrency

### 5) Backups and branches
- Enable scheduled backups in Neon dashboard
- Use branches for preview deployments; run prisma migrate deploy on each

---

## Unified Production Logic

### Environments
- ENVIRONMENT: development | preview | production
- Behavior toggles by ENVIRONMENT for logging verbosity, CORS, and rate limits

### API behavior
- All writes require valid JWT and access code validation gate
- Idempotent endpoints with conflict-safe UPSERTs in Prisma
- Central error formatter ensures consistent error payloads

### Media handling
- 5 slots max, 200MB per slot; allowed: mp4, webm, gif, jpg, png
- Server-side validation: mimetype, size, checksum
- Filenames normalized; stored under backend/upload/ with DB metadata

### Analytics
- On each page/API hit, log: ip, user-agent, route, referrer, latency
- Real-time counters served from DB with fallback memory cache
- Opt-out respected via DNT header (if present)

---

## Access Codes, Roles, and Permissions

### Roles
- admin: full access to dashboards, theme/media controls, user management
- user: limited dashboard, profile/theme selection, feedback submit
- guest: read-only portfolio access, cannot upload or change settings

### Access Codes
- USER_ACCESS_CODE: gate to request JWT; rotate via admin only
- Codes stored and verified in DB (access_codes table)
- Expiry and active flags enforced; attempts are rate-limited

### JWT
- HS256 with SECRET_KEY
- ACCESS_TOKEN_EXPIRE_MINUTES default: 30 (configurable)
- Tokens bound to role and minimal claims (sub, role, iat, exp)

### Rate limits
- Auth endpoints: 5/min/IP
- Media upload: 10/day/user, 200MB/slot, 5 slots
- Admin actions: 60/min/IP, burst 10

---

## Admin Dashboard (features)
- Auth: admin role required
- Access Codes: create/rotate/deactivate; view last used and expiry
- Themes: activate/deactivate themes; set defaults per user or global
- Media: enable/disable slots; replace assets; view size/checksum
- Users: promote/demote roles; deactivate users; reset passwords
- Analytics: live visitors, last 24h chart, top routes, referrers
- Settings: env toggles (read-only in prod), CORS allowlist, quotas
- Safety: confirmation modals and audit log for all mutating actions

## User Dashboard (features)
- Auth: user role required
- Profile: basic info, avatar
- Theme: choose from allowed themes; preview before apply
- Media: view allowed slots; upload within size/type rules
- Feedback: 1–5 star rating + optional comment

---

## Settings and Restrictions
- CORS: explicit allowlist per ENVIRONMENT
- Upload security: server-side file type sniffing and extension checks
- Path traversal prevention; store assets under fixed root only
- XSS/CSRF: output encoding + CSRF cookie for forms
- Password policy: min 12 chars; breached password check (k-anon)
- IP allowlist for admin routes (optional; set ADMIN_IP_ALLOWLIST)
- Audit logging for admin mutations with who/what/when

---

## API Routes (examples)
- POST /api/auth/login: { username, accessCode } -> JWT
- POST /api/auth/refresh -> JWT
- GET  /api/me -> user profile, role
- GET  /api/themes -> list allowed
- POST /api/themes/select -> set user theme
- POST /api/media/upload -> multipart upload (auth required)
- GET  /api/analytics/realtime -> counts
- POST /api/feedback -> rating/comment
- Admin only:
  - POST /api/admin/access-codes/rotate
  - POST /api/admin/themes/toggle
  - POST /api/admin/users/role
  - GET  /api/admin/audit

---

## Local Development
- Copy .env.example to .env and set values (see below)
- Start services: npm i && npm run dev
- Ensure Neon DATABASE_URL points to a dev branch or local Postgres
- Run: npx prisma migrate dev

---

## Environment Variables
Required for all environments (set in Vercel Project Settings):
- DATABASE_URL=postgres://user:pass@neon-host/db?sslmode=require
- AUTH_DATABASE_URL=optional separate URL (if splitting writes)
- USER_ACCESS_CODE=Venky@access345 (example; change in prod)
- SECRET_KEY=your-jwt-secret-key
- ALGORITHM=HS256
- ACCESS_TOKEN_EXPIRE_MINUTES=30
- ENVIRONMENT=production | preview | development
- ADMIN_IP_ALLOWLIST=comma-separated IPs (optional)
- NEXT_PUBLIC_SITE_URL=https://your-domain.tld

---

## Deployment (Vercel)

### 1) Prepare
- Push latest code to main; ensure prisma/schema.prisma is in repo
- Set all environment variables in Vercel dashboard
- Configure Framework Preset: Next.js; Node 18+

### 2) Build and run
- Vercel installs deps and builds Next.js
- After deploy, run prisma migrate deploy via:
  - Post-deploy command (Vercel job) or
  - One-off: vercel exec "npx prisma migrate deploy"

### 3) Preview branches
- For PRs, Neon branch per preview; set DATABASE_URL via Vercel env override
- Migration strategy: prisma migrate deploy on each preview

### 4) Custom domain
- Add domain in Vercel; set NEXT_PUBLIC_SITE_URL

### 5) Rollbacks
- Use Vercel deployment history
- Neon branches enable DB-level rollback if needed

---

## Operational Runbook
- Rotating access codes: Admin Dashboard > Access Codes > Rotate
- Emergency lockout: deactivate all codes; disable admin login by IP allowlist
- Quota breach: increase MEDIA quotas or clean unused assets
- Incident logging: review /api/admin/audit and analytics_events table

---

## Security Notes
- Never commit real secrets; use Vercel envs
- Rotate SECRET_KEY if compromised; all tokens become invalid
- Keep Prisma client and Next.js updated
- Enable 2FA on GitHub, Vercel, and Neon

---

## License
MIT License. Created with ❤️ for impressive portfolio experiences.
