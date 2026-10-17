# TalentFlow — Mini Applicant Tracking System

A full-stack recruiter workspace for managing candidates, tracking hiring stages, searching and filtering applicants, and monitoring recruitment metrics. Built with React + TypeScript + Vite + Tailwind CSS, Express + TypeScript, Prisma, and PostgreSQL.

## Features

- Recruiter registration, login, logout, protected API routes, bcrypt password hashing, HTTP-only session cookie.
- Database-backed dashboard KPIs, candidate activity chart, stage distribution, recent candidates, and activity.
- Candidate create/read/update/delete, profile and timeline, resume URL, skills, notes, department, source, and experience.
- Six-stage pipeline with persisted transitions, transition notes, history, and activity records.
- Server-side search, filters, sorting, and pagination; all records are scoped to the authenticated recruiter.
- Responsive interface, form feedback, confirmation before delete, and empty/loading/error states.
- PostgreSQL Docker Compose setup and Prisma seed data.

## Prerequisites

- Node.js 20 or newer and npm 10+
- Docker Desktop (or a local PostgreSQL 15+)

## Run locally

1. Extract the ZIP and open a terminal in `mini-ats`.
2. Install workspace dependencies:

   ```bash
   npm install
   ```

3. Create the backend environment file. Copy root `.env.example` to `backend/.env`. Change `JWT_SECRET` to a long random value before exposing the app.
4. Start PostgreSQL:

   ```bash
   docker compose up -d postgres
   ```

5. Generate Prisma Client, create/apply the development migration, and seed the demo account:

   ```bash
   npm run db:generate -w backend
   npm run db:migrate -w backend -- --name init
   npm run db:seed -w backend
   ```

6. Start the API and web client in separate terminals, or use `npm run dev` at the root:

   ```bash
   npm run dev
   ```

   Frontend: http://localhost:5173  
   API health: http://localhost:4000/api/health

### Demo account

- Email: `demo@miniats.dev`
- Password: `DemoATS2026!`

The seed command prints these credentials. Change/remove the demo account before production use.

## Environment variables

Backend (`backend/.env`):

| Variable | Purpose | Local default/example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://ats:ats_dev_password@localhost:5432/mini_ats?schema=public` |
| `JWT_SECRET` | Signs the session token | Set a unique random secret (32+ characters) |
| `FRONTEND_URL` | Exact frontend origin allowed by CORS | `http://localhost:5173` |
| `API_PORT` | API listen port | `4000` |
| `NODE_ENV` | Runtime mode | `development` |
| `COOKIE_SECURE` | Send cookie only over HTTPS | `false` locally, `true` in production |

Frontend optional environment (`frontend/.env.local`): `VITE_API_URL=https://your-api-domain.example/api`. Vite variables are public; never put secrets there.

## API overview

All endpoints use JSON. Authenticated endpoints use the HTTP-only `ats_token` cookie. Error responses use `{ "error": "..." }`; list responses include `data` and `pagination`.

- `POST /api/auth/register` — `{ name, email, password }`
- `POST /api/auth/login` — `{ email, password }`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/candidates?search=&stage=&department=&source=&minExperience=&maxExperience=&fromDate=&toDate=&sortBy=createdAt&sortOrder=desc&page=1&limit=10`
- `POST /api/candidates` — candidate details
- `GET /api/candidates/:id`
- `PATCH /api/candidates/:id`
- `DELETE /api/candidates/:id`
- `PATCH /api/candidates/:id/stage` — `{ stage, note? }`
- `GET /api/candidates/:id/history`
- `GET /api/dashboard/summary`
- `GET /api/dashboard/candidates-over-time`
- `GET /api/dashboard/stage-distribution`
- `GET /api/dashboard/recent-activity`
- `GET /api/meta` — stage, department, and source options

Stages are `APPLIED`, `SCREENING`, `INTERVIEW`, `OFFER`, `HIRED`, and `REJECTED`.

## Checks

```bash
npm run lint
npm run build
npm test -w backend
```

Run these after dependencies are installed. Database-dependent API behavior requires PostgreSQL and the migrations to be applied.

## Deployment (Render + managed PostgreSQL example)

1. Push the extracted project to a GitHub repository.
2. Create a managed PostgreSQL database and copy its **internal** connection string into backend `DATABASE_URL`.
3. Deploy the backend as a Node web service from the monorepo root. Build command: `npm install && npm run db:generate -w backend && npm run build -w backend`. Start command: `npm run db:deploy -w backend && npm run start -w backend`. Set `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `API_PORT=10000` (or the platform's assigned port), `NODE_ENV=production`, and `COOKIE_SECURE=true`. If the platform assigns `PORT`, update `backend/src/server.ts` to prefer `process.env.PORT` (recommended on platforms that require it).
4. Deploy the frontend as a static site. Build command: `npm install && npm run build -w frontend`; publish directory: `frontend/dist`. Set `VITE_API_URL=https://your-backend-domain.example/api` at build time.
5. Set backend `FRONTEND_URL` to the exact deployed frontend origin. Because authentication uses cookies, use HTTPS on both services and configure the same-site deployment appropriately. If frontend and API are on different registrable domains, browser third-party-cookie rules can block cookies; prefer same-site custom domains or update cookie `SameSite`/CSRF strategy deliberately.
6. Run the seed command only if you want demo records. Do not use the demo account in production.

### Production security notes

The app uses HTTP-only cookies, SameSite=Lax, strict CORS, and an Origin check for browser state-changing requests. Before a public production launch, review CSRF behavior against your exact hosting domains, configure rate limits at the edge, use same-site HTTPS domains, rotate secrets, and review privacy/retention requirements. This starter is not a substitute for a security review.

## Project structure

```text
mini-ats/
  frontend/src/App.tsx       # Auth, dashboard, candidate views, pipeline
  frontend/src/api.ts        # Axios client and domain types
  frontend/src/styles.css    # Responsive visual system
  backend/src/app.ts         # REST routes, auth, validation, error handling
  backend/src/server.ts      # API entrypoint
  backend/prisma/schema.prisma
  backend/prisma/seed.ts
  docker-compose.yml
  .env.example
```
