# Engineering Implementation Plan

This document provides a prioritized, step-by-step plan to resolve all findings from the recent audit report. The tasks are designed to be atomic and machine-readable for an AI developer agent, with the goal of bringing the codebase into 100% compliance with its documentation and architectural design.

---

### **P0 - Critical Code Fixes**

*   [x] **[FIX]**: Correct the Triggers API to align with the database schema.
    -   **File**: `admin/admin/src/app/api/triggers/[[...slug]]/route.ts`
    -   **Action**: In the `POST` and `PUT` handlers, replace the destructuring of `{ name, condition, action }` with `{ postId, keyword, userId, templateId }`. Update the `prisma.trigger.create` and `prisma.trigger.update` calls to use these correct fields as defined in `prisma/schema.prisma`.
    -   **Reason**: Audit finding: "The `POST /api/triggers` endpoint implementation is completely different from its documentation... Code Implementation: Expects `{ "name", "condition", "action" }`".

*   [x] **[REFACTOR]**: Remove obsolete bot health API route.
    -   **File**: `admin/admin/src/app/api/bot/health/route.ts`
    -   **Action**: Delete the file `admin/admin/src/app/api/bot/health/route.ts` and its parent directory.
    -   **Reason**: Audit finding: "Obsolete API routes... These routes are unused, undocumented, and should be removed to avoid confusion."

*   [x] **[REFACTOR]**: Remove obsolete bot healthcheck API route.
    -   **File**: `admin/admin/src/app/api/bot/healthcheck/route.ts`
    -   **Action**: Delete the file `admin/admin/src/app/api/bot/healthcheck/route.ts` and its parent directory.
    -   **Reason**: Audit finding: "Obsolete API routes... These routes are unused, undocumented, and should be removed to avoid confusion."

---

### **P1 - Implementation of Missing Features**

*(No tasks in this category. All core features are implemented, but have mismatches or configuration gaps addressed below.)*

---

### **P2 - Correcting Mismatches**

*   [x] **[CREATE]**: Create an example environment file for the Admin Panel.
    -   **File**: `admin/admin/.env.example`
    -   **Action**: Create a new file at this path. Add the following environment variables with placeholder values: `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
    -   **Reason**: Audit finding: "[MISSING FILE]: Admin Panel `.env.example`... there is no `admin/admin/.env.example` file to guide developers."

*   [x] **[UPDATE]**: Add missing environment variables to the bot's example env file.
    -   **File**: `instagram_bot/.env.example`
    -   **Action**: Add the `DM_RATE_LIMIT` and `ADMIN_USER_ID` variables to the file, providing default or placeholder values (e.g., `DM_RATE_LIMIT=10`).
    -   **Reason**: Audit finding: "[INCOMPLETE FILE]: Instagram Bot `.env.example`... `DM_RATE_LIMIT` and `ADMIN_USER_ID` are missing."

---

### **P3 - Documentation Updates**

*   [x] **[DOCS]**: Update the Triggers API documentation to match the corrected implementation.
    -   **File**: `docs/api_spec.md`
    -   **Action**: In the "Trigger Management" section, change the example request body for `POST /api/triggers` and `PUT /api/triggers/:id` to: `{ "postId": "INSTAGRAM_POST_ID", "keyword": "...", "userId": "...", "templateId": "..." }`.
    -   **Reason**: Audit finding: "The `POST /api/triggers` endpoint implementation is completely different from its documentation."

*   [x] **[DOCS]**: Remove non-existent Bot Service API endpoints from the API specification.
    -   **File**: `docs/api_spec.md`
    -   **Action**: Delete the "Bot Service API" section, including the entries for `GET /bot/config` and `POST /bot/healthcheck`, as the bot does not operate as a web server.
    -   **Reason**: Audit finding: "The Bot Service API endpoints documented in the spec do not exist."

*   [x] **[DOCS]**: Document the internal storage upload API endpoint.
    -   **File**: `docs/api_spec.md`
    -   **Action**: Add a new section, "Storage API," and document the `POST /api/storage/upload` endpoint. Specify that it is a protected route that accepts `FormData` with a `file` and returns a JSON object containing the `publicUrl`.
    -   **Reason**: Audit finding: "[Undocumented API Endpoint] `/api/storage/upload`... is a critical part of the template media upload feature."

*   [x] **[DOCS]**: Update the deployment guide with Admin Panel environment variables.
    -   **File**: `docs/deployment_guide.md`
    -   **Action**: Add a new sub-section under "Installation" or "Configuration" that lists the environment variables required for the `admin-panel` service. Reference the new `admin/admin/.env.example` file and explain each variable's purpose.
    -   **Reason**: Audit finding: "[UNDOCUMENTED VARIABLE]: `SUPABASE_SERVICE_ROLE_KEY` is used but not documented."

*   [x] **[DOCS]**: Document the Dead-Letter Queue Viewer feature in the functional requirements.
    -   **File**: `docs/functional_requirements.md`
    -   **Action**: Under the "Admin Panel Features" section, add a new sub-section named "Error Handling". Describe the "Error Queue" page, explaining that it displays failed events from the `DeadLetterQueue` table for easy diagnosis of bot and system errors.
    -   **Reason**: Audit finding: "[Inconsistent Documentation] Dead-Letter Queue Viewer... is a useful, implemented feature that is not mentioned in the documentation."