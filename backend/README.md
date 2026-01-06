# Auth Module (Backend)

This module implements JWT Authentication and Role-Based Access Control for UCHUMI_HMS.

## Key features
- Users, Roles, Permissions schema (PostgreSQL)
- JWT authentication (access tokens)
- Login, profile management, password reset scaffolding
- Role-based guard and decorator for protecting routes
- Redis-backed event bus for emitting `UserLoggedIn` and `UserRoleChanged`

## Quickstart
1. Configure environment variables: `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`, `REDIS_URL`
2. Run SQL migrations:
   - Auth: `psql -d $DB_NAME -f src/auth/migrations/001-create-auth-schema.sql`
   - Patient: `psql -d $DB_NAME -f src/patient/migrations/001-create-patient-schema.sql`
3. Install deps: `npm install`
4. Start dev server: `npm run start:dev`

### Visit module
- Directory: `backend/src/visit`
- Migrations: `src/visit/migrations/001-create-visit-schema.sql` (creates `visits`, `queues`, seeds `visit_status`)
- API endpoints:
  - POST /visits — create a visit (Receptionist/Doctor/Admin)
  - POST /visits/:id/complete — mark visit completed (Receptionist/Doctor/Admin)
  - GET /visits/queue/:department — get current queue for department
  - POST /visits/queue/:department/next — call next patient
  - GET /visits/patient/:id/history — get patient visit history

### Lab module
- Directory: `backend/src/lab`
- Migrations: `src/lab/migrations/001-create-lab-schema.sql` (creates `test_catalog`, `lab_results` and seeds some tests)
- API endpoints:
  - GET /lab/pending — list pending lab requests (LabTechnician)
  - POST /lab/results — enter a lab result (LabTechnician only)
  - GET /lab/request/:id/results — retrieve results for a lab request (LabTechnician, Doctor, Admin)
- Events: `LabCompleted`, `LabResultUpdated`
- Business rule: Only `LabTechnician` role can create or update lab results; results link back to Clinical `lab_requests`.

### Running integration tests (local)

1. Start test infra: `docker-compose -f docker-compose.test.yml up -d` (starts Postgres on port 5433 and Redis on port 63790)
2. Run migrations against test DB:
   - `psql -h localhost -p 5433 -U postgres -d uchumi_test -f src/auth/migrations/001-create-auth-schema.sql`
   - `psql -h localhost -p 5433 -U postgres -d uchumi_test -f src/patient/migrations/001-create-patient-schema.sql`
3. Run integration tests: `npm run test:integration`

CI note: a GitHub Actions workflow is provided in `.github/workflows/ci.yml` which brings up Postgres and Redis and runs migrations before running `npm test`.

## API examples
- POST /auth/login { email, password } -> { accessToken }
- GET /auth/profile (Authorization: Bearer <token>) -> user profile
- PATCH /auth/profile -> update profile
- POST /auth/admin/users/:id/roles { roles: ['Doctor'] } (Admin-only)

Security notes:
- Store JWT in an httpOnly cookie in production or use refresh tokens
- Implement token revocation/blacklist in Redis for logout
- Implement rate-limiting and account lockouts for brute-force protection

