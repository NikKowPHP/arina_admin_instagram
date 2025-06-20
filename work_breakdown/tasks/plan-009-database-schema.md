# Task: Database Schema Implementation

## Overview
Implement PostgreSQL database schema for triggers, templates, and activity logs.

## Tasks
1. Define Prisma schema for:
   - Triggers (id, post_id, keyword, template_id, is_active)
   - DM Templates (id, content, media_url)
   - Processed Comments (comment_id, post_id, processed_at)
   - Activity Log (id, user_id, action, details, timestamp)
   - Dead Letter Queue (id, user_id, action, details, error_message, timestamp)
2. Create database migration scripts
3. Implement database initialization in entrypoint scripts
4. Write unit tests for database models

## Files to Modify/Create
- `admin/admin/prisma/schema.prisma`
- `migrations/` (migration scripts)
- `admin/admin/src/lib/prisma.ts`
- `instagram_bot/database.py` (if needed)
- `tests/database_test.py`