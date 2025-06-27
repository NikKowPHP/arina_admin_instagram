# Technical Design Specification

## System Architecture
```text
[Instagram Users] <-> [Instagram API] <-> [Python Bot Service]
                              ^
                              |
                              v
[Admin Users] <-> [Next.js Admin Panel] <-> [Supabase Database]
```

### Components
1. **Instagram Bot Service** (Python)
   - Comment polling every 60s
   - Keyword matching engine
   - DM sending queue
   - Error handling and retries

2. **Admin Panel** (Next.js 14)
   - App Router structure:
     - `/app/login` - Auth page
     - `/app/dashboard` - Main interface
     - `/app/triggers` - CRUD operations
   - API Routes:
     - `/api/triggers` - Manage keywords
     - `/api/templates` - Handle DM content

3. **Database** (Supabase)
   - Tables:
     - `triggers` (post_id, keyword, template_id, is_active)
     - `templates` (content, media_url, metadata)
     - `activity_log` (timestamp, user_id, action)

## API Specifications

### Bot Service API
- POST `/bot/healthcheck` - Monitoring endpoint
- GET `/bot/config` - Retrieve active triggers

### Admin Panel API
- CRUD endpoints for all database tables
- JWT authentication via Supabase

### Supabase Integration
- Auth: Email/password with sessions
- Storage: Media files for DM templates
- Realtime: Updates to trigger configurations

## Security Design
- Rate limiting on public endpoints
- JWT validation for admin API
- Encrypted database connections
- Regular security audits

## Infrastructure
- Docker Compose setup:
  - `admin-panel` service (Next.js)
  - `bot-service` service (Python)
  - `supabase` service (local emulator)
- Environment variables for configuration
- Health monitoring endpoints

## Performance Considerations
- Caching of frequent API calls
- Bulk operations for trigger updates
- Async processing for DM delivery