# TalentFlow — Mini Applicant Tracking System

A full-stack recruiter workspace for managing candidates, tracking hiring stages, searching and filtering applicants, and monitoring recruitment metrics. Built with React + TypeScript + Vite + Tailwind CSS, Express + TypeScript, Prisma, and PostgreSQL.

## Live Demo

- **Live Application:** https://mini-ats-theta.vercel.app/
- **Backend API:** https://mini-ats-0xzb.onrender.com
- **API Health Check:** https://mini-ats-0xzb.onrender.com/api/health
- **GitHub Repository:** https://github.com/SaiRupesh07/Mini-Ats

## Features

- Recruiter registration, login, logout, protected API routes, bcrypt password hashing, and HTTP-only session cookies.
- Database-backed dashboard KPIs, candidate activity chart, stage distribution, recent candidates, and activity.
- Candidate create/read/update/delete, profile and timeline, resume URL, skills, notes, department, source, and experience.
- Six-stage pipeline with persisted transitions, transition notes, history, and activity records.
- Server-side search, filters, sorting, and pagination; all records are scoped to the authenticated recruiter.
- Responsive interface, form feedback, confirmation before delete, and empty/loading/error states.
- PostgreSQL Docker Compose setup and Prisma seed data.

## Prerequisites

- Node.js 20 or newer and npm 10+
- Docker Desktop (or a local PostgreSQL 15+)

## Run Locally

1. Clone the repository:

```bash
   git clone https://github.com/SaiRupesh07/Mini-Ats.git
   cd Mini-Ats
```

2. Install workspace dependencies:

```bash
   npm install
```

3. Create the backend environment file by copying the root `.env.example` to `backend/.env`. Set a unique, long random `JWT_SECRET`.

4. Start PostgreSQL:

```bash
   docker compose up -d postgres
```

5. Generate Prisma Client, apply the development migration, and seed demo data:

```bash
   npm run db:generate -w backend
   npm run db:migrate -w backend -- --name init
   npm run db:seed -w backend
```

6. Start the application:

```bash
   npm run dev
```

   - Frontend: http://localhost:5173
   - API health: http://localhost:4000/api/health

## Demo Account

- **Email:** `demo@miniats.dev`
- **Password:** `DemoATS2026!`

Use the seed command to create the demo account locally. Do not use demo credentials for a public production deployment.

## Environment Variables

Backend (`backend/.env`):

| Variable | Purpose | Local default/example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://ats:ats_dev_password@localhost:5432/mini_ats?schema=public` |
| `JWT_SECRET` | Signs the session token | Use a unique random secret of 32+ characters |
| `FRONTEND_URL` | Frontend origin allowed by CORS | `http://localhost:5173` |
| `API_PORT` | Local API port fallback | `4000` |
| `NODE_ENV` | Runtime mode | `development` |
| `COOKIE_SECURE` | Send cookies only over HTTPS | `false` locally, `true` in production |

Frontend optional environment (`frontend/.env.local`): `VITE_API_URL=https://mini-ats-0xzb.onrender.com/api`. Vite variables are public; never put secrets in them.

## API Overview

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

Run these after installing dependencies. Database-dependent API behavior requires PostgreSQL and the migrations to be applied.

## Deployment

- **Frontend:** Deployed on Vercel — https://mini-ats-theta.vercel.app/
- **Backend:** Deployed on Render — https://mini-ats-0xzb.onrender.com
- **Database:** PostgreSQL hosted on Neon.

The backend uses Render's assigned `PORT` when available. Production environment variables are configured in the hosting provider dashboards.

For cookie-based authentication, use HTTPS, configure the exact frontend origin in `FRONTEND_URL`, and ensure the cookie and CSRF settings match the hosting domains. Keep database credentials and JWT secrets out of source control.

## Production Security Notes

The app uses HTTP-only cookies, CORS restrictions, and an Origin check for browser state-changing requests. Before a public production launch, review CSRF behavior against the hosting domains, configure rate limits, rotate secrets, and review privacy and data-retention requirements. This starter is not a substitute for a security review.

## Project Structure

```text
Mini-Ats/
  frontend/src/App.tsx       # Auth, dashboard, candidate views, pipeline
  frontend/src/api.ts        # API client and domain types
  frontend/src/styles.css    # Responsive visual system
  backend/src/app.ts         # REST routes, auth, validation, error handling
  backend/src/server.ts      # API entrypoint
  backend/prisma/schema.prisma
  backend/prisma/seed.ts
  docker-compose.yml
  .env.example
```
