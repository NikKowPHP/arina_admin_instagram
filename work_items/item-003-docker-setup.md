# Docker Setup Missing for Bot Service

## Issue Description
The Docker build failed because the Dockerfile for the bot service is missing. This prevents the system from being built and run via Docker Compose as required by the canonical specification.

## Impact
- Unable to run end-to-end tests
- Cannot verify system functionality in a containerized environment
- Violates the "run locally via Docker" requirement from the spec

## Required Fixes
1. Create a Dockerfile for the Instagram bot service in `instagram_bot/Dockerfile`
2. Create a Dockerfile for the Next.js admin panel in `admin/admin/Dockerfile`
3. Verify/update docker-compose.yml to properly orchestrate both services
4. Ensure all dependencies are properly installed in containers
5. Add healthchecks and proper service networking

## Acceptance Criteria
- `docker-compose up --build` runs successfully
- All services start without errors
- System functions as specified when running in Docker