# Notton.ai

A task/day planner built with React + Vite on the frontend and Express + Prisma + Postgres on the backend.

## Features
- Category-based tasks (Work, Academics, Personal, Well-being + custom)
- Today board: add/remove/reorder, mark complete/incomplete, restore, soft-delete/archive
- Time & energy filters (All, 15m, 30m, 45m, 1h, 2h+ and All/Low/Med/High)
- Hover "Add to Today" per task, bulk add/delete on selection, restore completed tasks into categories
- Dark/light UI, Radix UI components, Tailwind v4 styling
- AI assistant via backend `/ai/chat` (OpenRouter proxy) can create tasks; uses model fallbacks with free-tier notice

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind v4, Radix UI, Lucide
- **Backend**: Express, Prisma (v6), Postgres

## Setup

### Prerequisites
- Node.js 18+
- Postgres (local or remote)

### Environment
Copy `.env.example` to `.env` and fill in:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"
DEFAULT_USER_EMAIL="demo@notton.ai"
PORT=4000
VITE_API_URL="http://localhost:4000"
OPENROUTER_API_KEY="your_key"
OPENROUTER_BASE_URL="https://openrouter.ai/api/v1"
OPENROUTER_MODEL="amazon/nova-2-lite-v1:free"   # first choice; fallbacks in code: gemini, llama 3.3 70B, mistral 7B
OPENROUTER_REFERER=""                           # optional
OPENROUTER_TITLE=""                             # optional
```

### Install & Database
```bash
# start postgres however you like (docker/local/cloud)
npm install
npx prisma migrate dev --name init
npx prisma generate
```

### Run
- API: `npm run server:dev` (PORT from `.env`, seeds default user + 4 categories on start; set `SEED_ON_START=false` to skip)
- UI: `npm run dev` (uses `VITE_API_URL`)

## Scripts
- `npm run dev` — Frontend dev server
- `npm run server:dev` — API dev server (tsx + nodemon)
- `npm run build` — Build frontend
- `npm run preview` — Preview build
- `npm run lint` — ESLint
- `npm run prisma:generate` — Generate Prisma client
- `npm run prisma:migrate` — Run migrations

## Notes
- Tasks are scoped per user; soft-delete uses `archivedAt`.
- Filters include “All” plus creation-time durations (15/30/45/60/120).
- AI chat uses the backend `/ai/chat` proxy with model fallbacks; free-tier models may respond slower.

## Project Structure
```
src/                  # Frontend
  components/         # UI components
server/               # Express API
prisma/               # Schema & migrations
```

## License
MIT — see [LICENSE](LICENSE).
