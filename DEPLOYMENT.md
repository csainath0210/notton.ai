# Deployment Guide

## Overview

This application has two parts:
1. **Frontend** (React/Vite) - Deployed to Netlify
2. **Backend** (Express API) - Must be deployed separately (Railway, Render, Heroku, etc.)

## Backend Deployment

### Option 1: Railway (Recommended)

1. Go to [railway.app](https://railway.app) and create a new project
2. Connect your GitHub repository
3. Add a PostgreSQL database service
4. Add a new service from your repo
5. Set environment variables:
   - `DATABASE_URL` - From your PostgreSQL service (Railway provides this)
   - `DEFAULT_USER_EMAIL` - `demo@notton.ai` (or your preferred email)
   - `PORT` - Railway will set this automatically
   - `DEFAULT_USER_ID` (optional) - A fixed UUID if you want consistent user ID
6. Railway will automatically:
   - Run `npm install`
   - Run `npx prisma generate`
   - Run `npx prisma migrate deploy`
   - Start the server with `npm run server:dev` or create a `start` script

### Option 2: Render

1. Go to [render.com](https://render.com) and create a new Web Service
2. Connect your GitHub repository
3. Add a PostgreSQL database
4. Set build command: `npm install && npx prisma generate && npx prisma migrate deploy`
5. Set start command: `node server/index.ts` (or use tsx: `npx tsx server/index.ts`)
6. Set environment variables (same as Railway)

### Option 3: Heroku

1. Create a Heroku app
2. Add Heroku Postgres addon
3. Set environment variables
4. Deploy via Git or GitHub integration

## Database Seeding

The backend now auto-seeds on startup if no default categories exist. However, you can also manually seed:

```bash
# On your local machine or in a one-off command
node prisma/seed.mjs
```

Or on Railway/Render, you can run a one-off command:
```bash
railway run node prisma/seed.mjs
```

## Frontend Deployment (Netlify)

1. Go to [netlify.com](https://netlify.com) and create a new site
2. Connect your GitHub repository
3. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. **IMPORTANT**: Set environment variable:
   - `VITE_API_URL` - Your backend URL (e.g., `https://your-backend.railway.app` or `https://your-backend.onrender.com`)
5. Deploy!

## Environment Variables Summary

### Backend (Railway/Render/Heroku)
- `DATABASE_URL` - PostgreSQL connection string
- `DEFAULT_USER_EMAIL` - Default user email (defaults to `demo@notton.ai`)
- `DEFAULT_USER_ID` (optional) - Fixed UUID for user
- `PORT` - Server port (usually auto-set by platform)

### Frontend (Netlify)
- `VITE_API_URL` - Your backend API URL (e.g., `https://your-api.railway.app`)

## Troubleshooting

### No categories showing up

1. **Check backend is running**: Visit `https://your-backend-url.com/categories` - should return JSON
2. **Check database is seeded**: The backend auto-seeds on startup, but verify:
   - Check backend logs for "Database seeded successfully"
   - Or manually run: `node prisma/seed.mjs`
3. **Check VITE_API_URL**: In Netlify, ensure `VITE_API_URL` is set correctly
4. **Check CORS**: Backend should allow requests from your Netlify domain

### CORS Issues

If you see CORS errors, update `server/index.ts`:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

Then set `FRONTEND_URL` environment variable in your backend to your Netlify URL.

## Quick Start Checklist

- [ ] Deploy backend to Railway/Render/Heroku
- [ ] Add PostgreSQL database
- [ ] Set backend environment variables
- [ ] Verify backend is running (check `/categories` endpoint)
- [ ] Deploy frontend to Netlify
- [ ] Set `VITE_API_URL` in Netlify environment variables
- [ ] Verify categories appear in the app

