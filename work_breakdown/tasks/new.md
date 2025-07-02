# Engineering Implementation Plan

This document provides a prioritized, step-by-step plan to resolve all findings from the recent audit report. The tasks are designed to be atomic and machine-readable for an AI developer agent, with the goal of bringing the codebase into 100% compliance with its documentation and architectural design.

---

### **P0 - Critical Code Fixes**

*   **[REFACTOR]**: Remove redundant `bot` directory to eliminate architectural ambiguity.
    -   **File**: `bot/`
    -   **Action**: Delete the entire `bot/` directory and all its contents.
    -   **Reason**: Audit finding: Architectural Ambiguity. The `docker-compose.yml` specifies `instagram_bot/` as the active service, making `bot/` redundant and confusing.

*   **[REFACTOR]**: Remove all redundant `bot-monitor` directories to clean up the project structure.
    -   **File**: `bot-monitor/`, `src/bot-monitor/`, `admin/admin/src/bot-monitor/`
    -   **Action**: Delete all three `bot-monitor` directories and their contents from the project.
    -   **Reason**: Audit finding: Architectural Ambiguity. Multiple unused `bot-monitor` directories exist, indicating an incomplete or abandoned feature and creating clutter.

*   **[CREATE]**: Add a healthcheck function to the main bot script for Docker.
    -   **File**: `instagram_bot/main.py`
    -   **Action**: At the end of the file, add a new function `check_health()` that attempts to connect to the database. It should print "healthy" and exit with code 0 on success, or print an error and exit with code 1 on failure.
    -   **Reason**: Audit finding: Docker healthcheck for the bot service is incorrect and non-functional. This new function will provide a reliable target for the healthcheck command.

*   **[FIX]**: Correct the bot service healthcheck command in `docker-compose.yml`.
    -   **File**: `docker-compose.yml`
    -   **Action**: In the `bot-service` definition, change the `healthcheck.test` command to `["CMD-SHELL", "python main.py check_health"]`.
    -   **Reason**: Audit finding: Docker healthcheck for the bot service is incorrect. The new command targets the `check_health` function created in the previous step.

---

### **P1 - Implementation of Missing Features**

*   **[CREATE]**: Create a new `bot_status` table in the database schema to store live health data.
    -   **File**: `admin/admin/prisma/schema.prisma`
    -   **Action**: Add a new model named `BotStatus` with fields: `id` (String, @id), `serviceName` (String, @unique), `isHealthy` (Boolean), `lastPing` (DateTime), `details` (Json?). Map the table to `bot_status`.
    -   **Reason**: Audit finding: System Health Monitoring is incomplete and relies on placeholder data. This table will store real data from the bot.

*   **[UPDATE]**: Implement logic in the Python bot to periodically write its health status to the database.
    -   **File**: `instagram_bot/instagram_bot.py`
    -   **Action**: In the `run` method's main `while True:` loop, add a call to a new method `_update_health_status()`. This new method will execute an `UPSERT` query on the `bot_status` table, setting `serviceName` to 'instagram_bot', `isHealthy` to `True`, `lastPing` to the current timestamp, and `details` with any relevant info.
    -   **Reason**: Audit finding: System Health Monitoring is incomplete. This action makes the bot proactively report its status.

*   **[UPDATE]**: Refactor the dashboard analytics API to fetch and return real bot health data.
    -   **File**: `admin/admin/src/app/api/dashboard/analytics/route.ts`
    -   **Action**: Modify the `GET` handler. Remove the placeholder `systemHealth` object. Instead, query the `bot_status` table using Prisma to get the latest health status for the 'instagram_bot' service. Format this real data to match the `BotHealthStatus` type and include it in the response.
    -   **Reason**: Audit finding: System Health Monitoring is incomplete and uses placeholder data. This connects the dashboard to the live data source.

---

### **P2 - Correcting Mismatches**

*   **[REFACTOR]**: Standardize bot database connection to use a single `DATABASE_URL` variable.
    -   **File**: `instagram_bot/instagram_bot.py`
    -   **Action**: Modify the `__init__` and `connect_to_database` methods. Remove the individual `db_host`, `db_port`, etc., variables. Instead, read a single `DATABASE_URL` from the environment variables and use it in the `psycopg2.connect()` call.
    -   **Reason**: Audit finding: Inconsistent DB credentials. This standardizes configuration with the admin panel, simplifying setup.

*   **[UPDATE]**: Update the bot's example environment file to use `DATABASE_URL`.
    -   **File**: `instagram_bot/.env.example`
    -   **Action**: Remove the `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` variables. Replace them with a single line: `DATABASE_URL="postgresql://postgres:password@db:5432/postgres"`.
    -   **Reason**: Audit finding: Inconsistent DB credentials. This makes the example file match the refactored code.

---

### **P3 - Documentation Updates**

*   **[DOCS]**: Update the API specification to match the implemented Trigger creation endpoint.
    -   **File**: `docs/api_spec.md`
    -   **Action**: In the "Trigger Management" section for `POST /api/triggers`, change the example request body from `{ "name", "condition", "action" }` to reflect the actual schema: `{ "postId": "...", "keyword": "...", "userId": "...", "templateId": "..." }`.
    -   **Reason**: Audit finding: API Mismatch. The documentation for the Trigger API does not match the implemented code and database schema.

*   **[DOCS]**: Update the API specification to remove the non-existent bot health endpoint.
    -   **File**: `docs/api_spec.md`
    -   **Action**: In the "Bot Service API" section, completely remove the entry for `GET /bot/health`.
    -   **Reason**: Audit finding: Bot Health Check endpoint is architecturally misrepresented. The bot does not run a web server, so this endpoint does not exist.

*   **[CREATE]**: Create an example environment file for the Admin Panel.
    -   **File**: `admin/admin/.env.example`
    -   **Action**: Create this new file and add the following required environment variables: `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
    -   **Reason**: Audit finding: Key environment variables for the Admin Panel are used but not documented in an example file.

*   **[DOCS]**: Update the deployment guide to include Admin Panel environment variables.
    -   **File**: `docs/deployment_guide.md`
    -   **Action**: Add a new section detailing the environment variables required for the `admin-panel` service, referencing the new `admin/admin/.env.example` file.
    -   **Reason**: Audit finding: `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_*` variables are used but not documented in the setup guide.

*   **[DOCS]**: Document the Dead-Letter Queue Viewer feature in the admin panel.
    -   **File**: `docs/functional_requirements.md`
    -   **Action**: Under the "Admin Panel Features" section, add a new sub-section for "Error Handling" that describes the "Error Queue" page, explaining that it displays failed events from the `DeadLetterQueue` table for easy diagnosis.
    -   **Reason**: Audit finding: Documentation Gap. The DLQ viewer is a useful, implemented feature that is not mentioned in the documentation.