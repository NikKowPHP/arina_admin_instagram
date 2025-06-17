# Ticket 1: Implement Core Instagram Bot Service

**State:** OPEN  
**Priority:** CRITICAL  
**Effort:** XL  
**Component:** `bot-service`

### Description

The primary functional component of the system, the Python-based Instagram bot, is completely missing from the codebase. The `docker-compose.yml` file defines a `bot-service` that points to an empty `/bot` directory.

### Acceptance Criteria

1.  Create a new Python application within the `/bot` directory.
2.  The application must be ableto be built and run by the existing `docker-compose.yml` configuration.
3.  Implement functionality to connect to the Supabase database to fetch active triggers and templates.
4.  Implement a polling mechanism to monitor comments on specified Instagram posts.
5.  Implement keyword matching logic based on the fetched triggers.
6.  Implement DM sending functionality using the appropriate template for a matched keyword.
7.  Ensure the service logs its activity to the `activity_log` table as defined in the project's documentation.
8.  Reference `documentation/technical_design.md` for the high-level architecture.
</create_file>
<create_file path="work_items/ticket-02-fix-dashboard-bugs.md">
# Ticket 2: Fix Critical Data-Fetching Bugs in Analytics Dashboard

**State:** OPEN  
**Priority:** CRITICAL  
**Effort:** M  
**Component:** `admin-panel`

### Description

The Analytics Dashboard at `/dashboard` is non-functional and will cause a server crash due to fatal errors in its data-fetching logic. The `getDashboardAnalytics` server action in `admin/admin/src/lib/actions.ts` attempts to query fields that do not exist in the Prisma schema.

### Bug Details

-   **File:** `admin/admin/src/lib/actions.ts`
-   **Function:** `getDashboardAnalytics`
-   **Invalid Query 1:** The query on the `User` model filters by a `lastLogin` field, which does not exist. The `User` model in `prisma/schema.prisma` has no such field.
-   **Invalid Query 2:** The query on the `Template` model selects a `name` field, which does not exist. The `Template` model has a `content` field but no `name`.

### Acceptance Criteria

1.  Modify the `getDashboardAnalytics` function in `admin/admin/src/lib/actions.ts`.
2.  Correct the user activity query. A different metric for "active users" must be devised (e.g., based on recent entries in `activity_log`) or the metric must be removed.
3.  Correct the template usage query to use an existing, relevant field from the `Template` model, such as `content` or `id`, for identifying templates.
4.  The dashboard page at `/dashboard` must load without crashing and display the analytics charts with the corrected data.
</create_file>
<create_file path="work_items/ticket-03-implement-rest-apis.md">
# Ticket 3: Implement Missing REST APIs for Triggers and Templates

**State:** OPEN  
**Priority:** HIGH  
**Effort:** L  
**Component:** `admin-panel`

### Description

The backend is missing the REST API endpoints required for managing triggers and templates, despite them being defined in the project's technical documentation. The only existing APIs are for bot health.

### Acceptance Criteria

1.  Create the necessary Next.js API route files to handle trigger and template management.
    -   Suggested location: `admin/admin/src/app/api/triggers/[[...slug]]/route.ts`
    -   Suggested location: `admin/admin/src/app/api/templates/[[...slug]]/route.ts`
2.  Implement full CRUD (Create, Read, Update, Delete) functionality for both `triggers` and `templates`.
3.  The API logic should use the Prisma client to interact with the database.
4.  Secure all endpoints, requiring valid user authentication for any operation.
5.  Ensure the implementation matches the specifications laid out in `documentation/api_spec.md`.
</create_file>
<create_file path="work_items/ticket-04-create-template-ui.md">
# Ticket 4: Create Template Management User Interface

**State:** OPEN  
**Priority:** HIGH  
**Effort:** M  
**Component:** `admin-panel`

### Description

The admin panel lacks the user interface for managing DM templates. While the backend models and actions exist, there is no corresponding page for admins to perform CRUD operations. The original plan in `todos/dev_todo_phase_3.md` was not completed.

### Acceptance Criteria

1.  Create a new page at `admin/admin/src/app/dashboard/templates/page.tsx`.
2.  This page should display a list of all existing templates in a data table, showing template content and status.
3.  Include a "Create New Template" button on the page.
4.  Implement a form (either on a new page or in a modal) for creating and editing templates. The form should include fields for `content`, `mediaUrl`, and an `isActive` toggle.
5.  Connect the form to the existing `createTemplate` and `updateTemplate` server actions.
6.  Ensure "Edit" and "Delete" buttons are present for each template in the list and are connected to the appropriate server actions.
7.  Add a navigation link to `/dashboard/templates` in the main sidebar.
</create_file>
<create_file path="work_items/ticket-05-update-documentation.md">
# Ticket 5: Correct and Align All Project Documentation

**State:** OPEN  
**Priority:** MEDIUM  
**Effort:** L  
**Component:** `documentation`

### Description

The project documentation in the `/documentation` directory is severely outdated and does not accurately represent the codebase. It describes features that don't exist and configurations that are incorrect. This ticket should be completed *after* all other implementation and bug-fix tickets are resolved.

### Inaccurate Documents

-   `documentation/api_spec.md`: Describes APIs that were never built.
-   `documentation/technical_design.md`: Describes a Python bot that is missing.
-   `documentation/deployment_guide.md`: Contains an incorrect `docker-compose.yml` example with wrong ports and service definitions.
-   Other documents may contain similar inaccuracies.

### Acceptance Criteria

1.  Thoroughly review every file in the `/documentation` directory.
2.  Update the `technical_design.md` and related documents to reflect the *actual* implementation of the bot service (once Ticket #1 is complete).
3.  Update `api_spec.md` to match the *actual* implemented REST APIs (once Ticket #3 is complete).
4.  Correct the `docker-compose.yml` example in `deployment_guide.md` to match the root `docker-compose.yml` file.
5.  Ensure all user stories and requirements from the business/functional documents are met by the final codebase and that the documentation reflects this.
</create_file>
<create_file path="work_items/ticket-06-implement-auth-guard.md">
# Ticket 6: Implement Authentication Guard for Dashboard Routes

**State:** OPEN  
**Priority:** HIGH  
**Effort:** S  
**Component:** `admin-panel`

### Description

The application currently lacks a mechanism to protect the dashboard routes from unauthenticated access. A user can navigate directly to `/dashboard` without being logged in.

### Acceptance Criteria

1.  Implement an authentication check that runs for all routes under `/dashboard`.
2.  A layout file at `admin/admin/src/app/dashboard/layout.tsx` is the preferred location for this logic.
3.  The check should use the Supabase client to verify if a valid user session exists.
4.  If no session is found, the user must be redirected to the `/login` page.
5.  The implementation should be server-side to prevent the dashboard UI from ever rendering for an unauthenticated user.
</create_file>