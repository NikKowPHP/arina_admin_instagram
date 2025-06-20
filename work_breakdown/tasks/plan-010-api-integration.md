# Task: API Integration Implementation

## Overview
Connect bot service with admin panel via API.

## Tasks
1. Create REST API endpoints in admin panel for:
   - Trigger management (CRUD)
   - Template management (CRUD)
   - Bot health status
   - Analytics data
2. Implement API authentication using JWT tokens
3. Create API client in bot service to fetch triggers/templates
4. Implement WebSocket connection for real-time dashboard updates
5. Write integration tests for API endpoints

## Files to Modify/Create
- `admin/admin/src/app/api/triggers/[[...slug]]/route.ts`
- `admin/admin/src/app/api/templates/[[...slug]]/route.ts`
- `admin/admin/src/app/api/bot/health/route.ts`
- `admin/admin/src/app/api/ws/dashboard/route.ts`
- `instagram_bot/api_client.py`
- `tests/api_integration_test.py`