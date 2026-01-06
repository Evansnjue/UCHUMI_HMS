# UCHUMI_HMS
A state of the art HMS

## Auth module (built-in scaffold)
This repository includes a production-grade scaffold for an Authentication & RBAC module using:
- Backend: Node.js + NestJS + TypeScript
- Database: PostgreSQL
- Frontend: React + TypeScript
- Events: Redis pub/sub

### Backend (auth)
- Directory: `backend/src/auth`
- Start dev server:
  1. Install: `cd backend && npm install`
  2. Create database and run migration: `psql -d $DB_NAME -f src/auth/migrations/001-create-auth-schema.sql`
  3. Set env vars: `JWT_SECRET`, `DB_*`, `REDIS_URL`
  4. Start: `npm run start:dev`

### Frontend (auth)
- Directory: `frontend`
- Start dev server:
  1. Install: `cd frontend && npm install`
  2. Start: `npm run start`

If you'd like, I can fully initialize a Nest app and a React app (with Vite) in this workspace, add CI, and wire up Dockerfiles for production.
