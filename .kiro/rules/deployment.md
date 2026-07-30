---
description: Deployment and hosting rules for the resume portfolio project
alwaysApply: true
---

# Agent instructions (Resume Portfolio)

Read this file first when the task involves **deploy, hosting, CI/CD, Vercel, Railway, production env vars, or domains**.

## Stack (production)

| Layer | Host | Repo path | Deploy trigger |
|-------|------|-----------|----------------|
| React SPA | Vercel | `/` (root) | Git push to `main` |
| Express API | Railway service `api` (env `production`) | `/server` | Git push to `main` when `server/**` changes |
| PostgreSQL | Railway | — | Managed service |

## Stack (dev / staging)

| Layer | Host | Deploy trigger |
|-------|------|----------------|
| React SPA | Vercel Preview (`dev` branch) | Git push to `dev` |
| Express API | Railway service `api` (env `dev`) | Git push to `dev` when `server/**` changes |
| PostgreSQL | Railway Postgres in env `dev` | Managed |

## Config files agents must not break

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build configuration |
| `server/railway.toml` | API Docker build + watchPatterns |
| `server/Dockerfile` | API runtime |
| `.env` | Local dev env vars (never commit) |

## Quick verification after deploy

```bash
curl -s https://<API_URL>/health          # {"status":"ok"} JSON
curl -sI -H "Origin: https://<SITE_URL>" https://<API_URL>/api/profile | grep -i access-control
```

## Environment variables

### Frontend (Vite — prefixed with `VITE_`)
- `VITE_API_URL` — backend API base URL

### Backend (Railway)
- `DATABASE_URL` — Railway PostgreSQL connection string
- `GITHUB_TOKEN` — GitHub fine-grained PAT for repo access
- `JWT_SECRET` — admin auth signing key
- `CORS_ORIGIN` — allowed frontend origin

## Other conventions

- Commit messages: see `.kiro/rules/commits.md` (conventional commits, subject only)
- Do NOT commit `.env`, `.env.local`, `server/.env`, or secrets
- Do NOT commit unless the user explicitly asks to commit
- Do NOT push directly to main without explicit permission
