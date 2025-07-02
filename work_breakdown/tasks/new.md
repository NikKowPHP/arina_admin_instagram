Here is the prioritized implementation plan to resolve all issues found during the audit.

### Plan Summary

This plan addresses all discrepancies between the project's documentation and its implementation. It is structured into three prioritized tiers:

*   **P0: Critical Code Fixes:** A single, critical bug that prevents the bot from authenticating with Instagram.
*   **P2: Correcting Mismatches:** Refactoring code to remove redundancy, adding missing fields to APIs, and creating a missing configuration file.
*   **P3: Documentation Updates:** A series of tasks to update all relevant documentation (`.md` files, tests) to accurately reflect the implemented architecture, removing references to non-existent HTTP endpoints and adding details about undocumented but functional features.

Completing this plan will bring the codebase into 100% compliance with its documentation.

---

### P0 - Critical Code Fixes

- [x] **FIX**: Correct environment variable name in Python bot
    - **File**: `instagram_bot/instagram_bot.py`
    - **Action**: Change the line `self.instagram_user = os.getenv("INSTAGRAM_USERNAME")` to `self.instagram_user = os.getenv("INSTAGRAM_USER")` to match the variable defined in `.env.example`.
    - **Reason**: Audit finding: Environment Variable Mismatch. The code is trying to read `INSTAGRAM_USERNAME` but the configuration specifies `INSTAGRAM_USER`.

---

### P2 - Correcting Mismatches

- [ ] **REFACTOR**: Remove redundant trigger deletion API route
    - **File**: `admin/admin/src/app/api/triggers/[id]/route.ts`
    - **Action**: Delete this file entirely. Its functionality is already covered by the `DELETE` handler in `admin/admin/src/app/api/triggers/[[...slug]]/route.ts`.
    - **Reason**: Audit finding: Redundant API routes for Trigger Deletion. Having two endpoints for the same action is confusing and unnecessary.

- [x] **UPDATE**: Add `isActive` field handling to the trigger update API
    - **File**: `admin/admin/src/app/api/triggers/[[...slug]]/route.ts`
    - **Action**: In the `PUT` function, read the `isActive` boolean value from the request body. Add `isActive` to the object passed to `supabase.from('triggers').update(...)`. Ensure proper type handling (it should be a boolean).
    - **Reason**: Audit finding: `PUT /api/triggers/:id` is missing the `isActive` field, which is specified as a possibility in the documentation.

- [ ] **REFACTOR**: Delete obsolete bot health API route
    - **File**: `admin/admin/src/app/api/bot/health/route.ts`
    - **Action**: Delete this file.
    - **Reason**: Audit finding: Obsolete Bot Monitoring Service. The bot is not an HTTP service, making this API endpoint non-functional and misleading.

- [ ] **REFACTOR**: Delete obsolete bot healthcheck API route
    - **File**: `admin/admin/src/app/api/bot/healthcheck/route.ts`
    - **Action**: Delete this file.
    - **Reason**: Audit finding: Obsolete Bot Monitoring Service. The bot is not an HTTP service, making this API endpoint non-functional and misleading.

- [x] **CREATE**: Create example environment file for the admin panel
    - **File**: `admin/admin/.env.example`
    - **Action**: Create a new file named `.env.example` in the `admin/admin/` directory. Add the following required environment variables with placeholder values: `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
    - **Reason**: Audit finding: Missing Configuration File. The deployment guide requires these variables, but no example file is provided.

---

### P3 - Documentation Updates

- [x] **DOCS**: Update API spec to remove bot health endpoints
    - **File**: `docs/api_spec.md`
    - **Action**: Search for and remove any mention of bot-specific HTTP endpoints, such as `POST /bot/healthcheck`.
    - **Reason**: Audit finding: Architectural Mismatch in Bot Health Check. The documentation incorrectly describes the bot as an HTTP service.

- [x] **DOCS**: Update technical design to reflect the bot's non-HTTP nature
    - **File**: `docs/technical_design.md`
    - **Action**: In the "Bot Service API" section, remove the endpoints. In the "Components" section for the bot, clarify that it is a standalone polling script that interacts with the database, not an HTTP service.
    - **Reason**: Audit finding: Architectural Mismatch in Bot Health Check. The documentation needs to be corrected to reflect the actual implementation.

- [x] **DOCS**: Update integration test to remove invalid bot health check
    - **File**: `tests/docker_integration_test.py`
    - **Action**: Remove the entire `test_bot_service_service` method, as it attempts to make an HTTP request to a non-existent endpoint.
    - **Reason**: Audit finding: Architectural Mismatch in Bot Health Check. The test is invalid and will always fail because the bot does not run a web server.

- [x] **DOCS**: Update Templates API spec to include `media_url`
    - **File**: `docs/api_spec.md`
    - **Action**: For the Template Management endpoints (`POST`, `GET`, `PUT`), add an optional `media_url: "string"` field to the JSON payloads and responses to reflect the actual implementation.
    - **Reason**: Audit finding: Templates API payload differs from spec. The `media_url` field is implemented but not documented.

- [x] **DOCS**: Document the `bot_status` table and health update flow
    - **File**: `docs/technical_design.md`
    - **Action**: Add a new subsection under "Database" or "System Architecture" that describes the `bot_status` table. Explain that the Python bot periodically writes its health status to this table, and the admin dashboard reads from it to display the bot's health.
    - **Reason**: Audit finding: Undocumented `bot_status` Table. This core monitoring feature is not documented.

- [ ] **DOCS**: Document the use of Next.js Server Actions for trigger management
    - **File**: `docs/technical_design.md`
    - **Action**: Add a note under the "Admin Panel" section clarifying that the UI uses a mixed architecture. While RESTful API routes exist, some features like the Triggers page use Next.js Server Actions (defined in `lib/actions.ts`) for data manipulation.
    - **Reason**: Audit finding: Mixed API/Server Action Architecture. This implementation detail is not documented and is important for future developers.