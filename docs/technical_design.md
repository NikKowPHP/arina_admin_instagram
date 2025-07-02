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
1. **Instagram Bot Service** (Python - Standalone Polling Script)
   - Polls database every 60s for active triggers
   - Monitors Instagram comments via API
   - Sends DMs directly via Instagram API
   - Writes status updates to database
   - No HTTP interface (direct database access only)

2. **Admin Panel** (Next.js 14)
    - App Router structure:
      - `/app/login` - Auth page
      - `/app/dashboard` - Main interface
      - `/app/triggers` - CRUD operations
    - Mixed Architecture:
      - RESTful API routes for most operations (`/api/*`)
      - Next.js Server Actions (defined in `lib/actions.ts`) for:
        - Trigger management forms
        - Real-time status updates
        - Other interactive UI elements
      - Benefits:
        - Reduced client-side JavaScript
        - Progressive enhancement
        - Simplified data mutation flows
    - API Routes:
      - `/api/triggers` - Manage keywords
      - `/api/templates` - Handle DM content

3. **Database** (Supabase)

### Bot Status Monitoring
The bot periodically writes its health status to the `bot_status` table:
- `service_name`: Identifier for the service (e.g., "instagram_bot")
- `is_healthy`: Boolean indicating operational status
- `last_ping`: Timestamp of last update
- `details`: JSON with additional metrics (active triggers, errors, etc.)

Example status update flow:
1. Bot checks its health every 60 seconds
2. Writes status to `bot_status` table with current metrics
3. Admin dashboard reads this table to display bot health status
4. Alerts triggered if `is_healthy` is false or last update is stale

The table uses upsert logic to maintain a single row per service.
   - Tables:
     - `triggers` (post_id, keyword, template_id, is_active)
     - `templates` (content, media_url, metadata)
     - `activity_log` (timestamp, user_id, action)
     - `bot_status` (service_name, is_healthy, last_ping, details)

## API Specifications

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