# Task: Docker Setup Implementation

## Overview
Create Docker configuration for local development and testing.

## Tasks
1. Create Dockerfile for Python bot service
2. Create Dockerfile for Next.js admin panel
3. Implement docker-compose.yml with services:
   - Bot service
   - Admin panel
   - PostgreSQL database
   - Supabase (if needed)
4. Configure environment variables for containers
5. Add entrypoint scripts for initialization
6. Write integration tests for Docker setup

## Files to Modify/Create
- `instagram_bot/Dockerfile`
- `admin/admin/Dockerfile`
- `docker-compose.yml`
- `instagram_bot/entrypoint.sh`
- `admin/admin/entrypoint.sh`
- `tests/docker_integration_test.py`