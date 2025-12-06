# Notton.ai

A modern task/day planner built with React, TypeScript, Tailwind, Express, and Prisma (Postgres).

## Features

- Category-based tasks (Work, Academics, Personal, Well-being + custom)
- Today board with manual add/remove/reorder and completion
- Time & energy filters (All, 15m, 30m, 45m, 1h, 2h+ and All/Low/Med/High)
- Add/restore/delete tasks, hover add-to-today, bulk actions
- Dark/light UI, Radix UI components, Tailwind v4

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind v4, Radix UI, Lucide
- **Backend**: Express, Prisma (v6), Postgres

## Setup

### Prerequisites
- Node.js 18+
- Postgres running locally or remote

### Env
Create `.env` (see `.env.example`):
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"
DEFAULT_USER_EMAIL="demo@notton.ai"
PORT=4000
VITE_API_URL="http://localhost:4000"
VITE_GEMINI_API_KEY=AIzaSyDSgBmeDTC8_glM2oioDOmuot8156I3mVc
```

Replace API key if it hits limit

### Install & DB
```bash
docker compose up -d    # for postgres
npm install
npx prisma migrate dev --name init
npx prisma generate
node prisma/seed.mjs   # seeds default user + 4 categories
```

### Run
- API: `npm run server:dev` (PORT from `.env`)
- UI: `npm run dev` (uses `VITE_API_URL`)

## Scripts
- `npm run dev` – Frontend dev server
- `npm run server:dev` – API dev server (tsx + nodemon)
- `npm run build` – Build frontend
- `npm run preview` – Preview frontend build
- `npm run lint` – ESLint
- `npm run prisma:generate` – Generate Prisma client
- `npm run prisma:migrate` – Run migrations
- `npm run prisma:seed` – Seed defaults

## Notes
- Delete/restore are scoped per user (Postgres via Prisma).
- Filters include “All” plus creation-time durations (15/30/45/60/120).
- Add-to-today buttons show on hover; bulk actions appear when tasks are selected.

## Project Structure
```
src/                  # Frontend
  components/         # UI components
  styles/             # Tailwind
server/               # Express API
prisma/               # Schema & seed
```

## License
MIT – see [LICENSE](LICENSE).
