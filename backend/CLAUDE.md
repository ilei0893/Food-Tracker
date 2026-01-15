# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FoodTracker is a Rails 8.0 application using PostgreSQL as the database. The application uses modern Rails features including Hotwire (Turbo and Stimulus), solid_cache, solid_queue, and solid_cable for caching, background jobs, and Action Cable respectively.

**Ruby version:** 3.4.5

## Development Commands

### Setup
```bash
bin/setup              # Initial setup: installs dependencies, prepares database
bin/rails db:setup     # Create database and load schema
bin/rails db:seed      # Load seed data
```

### Running the Application
```bash
bin/dev                # Start development server (uses Puma)
bin/rails server       # Alternative way to start the server
bin/rails console      # Start Rails console
```

### Database
```bash
bin/rails db:create              # Create databases
bin/rails db:migrate             # Run migrations
bin/rails db:rollback            # Rollback last migration
bin/rails db:schema:load         # Load schema into database
bin/rails db:test:prepare        # Prepare test database
```

### Testing
```bash
bin/rails test                   # Run all tests
bin/rails test:system            # Run system tests only
bin/rails test test/models       # Run specific test directory
bin/rails test test/models/user_test.rb  # Run specific test file
bin/rails test test/models/user_test.rb:12  # Run specific test by line number
```

### Code Quality
```bash
bin/rubocop              # Run linter (uses rubocop-rails-omakase)
bin/rubocop -a           # Auto-fix linting issues
bin/brakeman             # Security vulnerability scanner
bin/importmap audit      # Check JavaScript dependencies for vulnerabilities
```

### Background Jobs
```bash
bin/jobs                 # Run Solid Queue worker
```

### Deployment (Kamal)
```bash
bin/kamal setup          # Initial deployment setup
bin/kamal deploy         # Deploy application
bin/kamal console        # Open Rails console on server
bin/kamal shell          # Open bash shell on server
bin/kamal logs           # Tail application logs
bin/kamal dbc            # Open database console on server
```

## Architecture

### Database Setup
The application uses **multiple PostgreSQL databases** in production:
- **Primary database**: Main application data
- **Cache database**: For solid_cache (replaces Redis for caching)
- **Queue database**: For solid_queue (background jobs)
- **Cable database**: For solid_cable (Action Cable/WebSockets)

Each has separate migrations in `db/cache_migrate/`, `db/queue_migrate/`, and `db/cable_migrate/`.

### Frontend Stack
- **Asset Pipeline**: Propshaft (modern, simpler alternative to Sprockets)
- **JavaScript**: Import maps (no Node.js required)
- **Frontend Framework**: Hotwire
  - Turbo: SPA-like page transitions without writing JavaScript
  - Stimulus: Modest JavaScript framework for sprinkles of interactivity
- **Controllers**: Stimulus controllers in `app/javascript/controllers/`

### Background Jobs
Uses **Solid Queue** which runs inside the Puma process in development (controlled by `SOLID_QUEUE_IN_PUMA` env variable). Jobs are defined in `app/jobs/`.

Recurring jobs can be configured in `config/recurring.yml`.

### Caching
Uses **Solid Cache** (database-backed) instead of Redis. Configuration in `config/cache.yml`.

### Configuration Files
- `config/database.yml`: Multi-database setup (primary, cache, queue, cable)
- `config/deploy.yml`: Kamal deployment configuration
- `config/importmap.rb`: JavaScript module mappings
- `config/routes.rb`: Application routes

### CI/CD
GitHub Actions workflow (`.github/workflows/ci.yml`) runs:
1. **Brakeman** security scan
2. **Importmap audit** for JS vulnerabilities
3. **RuboCop** linting
4. **Full test suite** (unit + system tests with PostgreSQL)

System test screenshots are preserved on failure.

## Development Notes

### Code Style
Follows Rails Omakase styling via `rubocop-rails-omakase`. Configuration in `.rubocop.yml`.

### Testing
- Unit tests: `test/models/`, `test/controllers/`, etc.
- System tests: `test/system/` (uses Selenium WebDriver + Capybara)
- Test helper: `test/test_helper.rb`
- System test setup: `test/application_system_test_case.rb`

### Deployment
Configured for deployment via Kamal (Docker-based). The application is containerized using the `Dockerfile` and deployed with Thruster as a proxy for SSL termination.
