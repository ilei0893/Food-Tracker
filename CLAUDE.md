# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Food Tracker is a full-stack application with:
- **Frontend**: Next.js 16 with React 19, TypeScript, and Tailwind CSS 4 (runs on port 3000)
- **Backend**: Rails 8.0 API with PostgreSQL (runs on port 3001)

The frontend communicates with a USDA Food Database API via Next.js API routes (`/api/*`), with plans for Rails API integration.

## Development Commands

### Frontend Only (from /frontend)
```bash
npm run dev              # Start Next.js dev server (port 3000)
npm run build            # Production build
npm run lint             # ESLint
```

### Backend Only (from /backend)
```bash
bin/dev                  # Start Rails with Puma
bin/rails server -p 3001 # Alternative (explicit port)
bin/rails test           # Run all tests
bin/rails test test/path/to/test.rb:42  # Run specific test by line
bin/rubocop              # Lint Ruby code
bin/rubocop -a           # Auto-fix lint issues
bin/brakeman             # Security scan
```

### Database (from /backend)
```bash
bin/rails db:setup       # Create and setup database
bin/rails db:migrate     # Run migrations
bin/rails db:test:prepare  # Prepare test DB
```

## Architecture

### API Communication Pattern
Frontend uses Next.js API routes as a proxy layer:
- `frontend/app/api/*` - Next.js API route handlers
- `frontend/lib/api.ts` - Client-side API wrapper (`ApiClient` class)
- API routes call external services (USDA API) or Rails backend

### Backend Structure
Rails API-only app using:
- Multi-database PostgreSQL (primary, cache, queue, cable)
- Solid Queue for background jobs (runs in Puma process)
- Solid Cache for caching (database-backed)
- API routes namespaced under `/api/v1/`

### Frontend Structure
- `frontend/app/` - Next.js App Router pages and API routes
- `frontend/lib/` - Shared utilities (API client)
- Uses Tailwind CSS v4 with PostCSS

### Environment Configuration
- `frontend/.env.local` - Frontend environment (USDA_API_URL, USDA_API_KEY)
- CORS configured in `backend/config/initializers/cors.rb` for localhost:3000/3001

## CI/CD

Backend has GitHub Actions workflow (`.github/workflows/ci.yml`) running:
- Brakeman security scan
- RuboCop linting
- Full test suite with PostgreSQL