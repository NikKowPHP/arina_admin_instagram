

### **`work_breakdown/master_implementation_plan.md` (Revised for Efficiency)**

**Objective:** To complete the final implementation phase of the Instagram Bot System. This plan provides atomic, verifiable tasks for the Developer AI, prioritizing a stateless and efficient client-side data-fetching strategy for the dashboard.

**Legend:**
-   `[ ]` = A pending task for the Developer AI to execute.
-   `[x]` = A task that has been verified as complete in the codebase.
-   `[HUMAN]` = A task that requires human intervention.

---

### **Part 1: Template Management - Media Uploads**

**Goal:** Implement file uploads for DM templates using Supabase Storage, a core requirement from the documentation.

-   [ ] **Task 1.1: Create Media Upload API Endpoint**
    -   [ ] **Action:** Create a new file: `admin/admin/src/app/api/storage/upload/route.ts`.
    -   [ ] **Action:** Inside this file, implement a `POST` function that:
        1.  Authenticates the user via Supabase.
        2.  Accepts `FormData` with a file.
        3.  Uses `supabase.storage.from('templates').upload(...)` to save the file to a 'templates' bucket in Supabase Storage.
        4.  Returns the public URL of the uploaded file as JSON.

-   [ ] **Task 1.2: Integrate File Upload into Template Form**
    -   [ ] **Action:** Open `admin/admin/src/app/dashboard/templates/page.tsx`.
    -   [ ] **Action:** Add an `<input type="file">` to the template creation/editing form.
    -   [ ] **Action:** Modify the `handleCreate` and `handleUpdate` functions. If a file is selected, first `POST` it to the new `/api/storage/upload` endpoint.
    -   [ ] **Action:** Use the returned URL from the upload endpoint to populate the `media_url` field before sending the data to the templates API.

-   [HUMAN] **Task 1.3: Create Supabase Storage Bucket**
    -   [ ] **Action:** A human operator must log in to the Supabase dashboard.
    -   [ ] **Action:** Navigate to the "Storage" section and create a new **public** bucket named `templates`.

---

### **Part 2: Efficient Dashboard Data Fetching (SWR)**

**Goal:** Refactor the dashboard to use SWR for efficient, on-demand data fetching, eliminating the need for WebSockets.

-   [ ] **Task 2.1: Create a Centralized Dashboard API Endpoint**
    -   [ ] **Action:** Create a new API route file: `admin/admin/src/app/api/dashboard/analytics/route.ts`.
    -   [ ] **Action:** Move the data aggregation logic from `lib/actions.ts` (`getDashboardAnalytics`) into this new file's `GET` handler. This handler should fetch all necessary data (trigger usage, template stats, user activity, etc.) and return it as a single JSON response.

-   [ ] **Task 2.2: Refactor Dashboard Page to Use SWR**
    -   [ ] **Action:** Open `admin/admin/src/app/dashboard/page.tsx`.
    -   [ ] **Action:** Remove all existing `useEffect` and `useState` hooks related to manual data fetching and WebSockets.
    -   [ ] **Action:** At the top of the component, import the `useSWR` hook: `import useSWR from 'swr'`.
    -   [ ] **Action:** Create a simple `fetcher` function: `const fetcher = url => fetch(url).then(res => res.json())`.
    -   [ ] **Action:** Use the SWR hook to fetch data from the new endpoint: `const { data, error, isLoading } = useSWR('/api/dashboard/analytics', fetcher, { refreshInterval: 30000 });`. This will poll every 30 seconds and automatically re-fetch on window focus.
    -   [ ] **Action:** Update the component's JSX to conditionally render based on `isLoading`, `error`, and `data`. The chart components should now receive their props directly from the `data` object returned by `useSWR`.
    -   [ ] **Action:** Delete the obsolete WebSocket files: `admin/admin/src/app/api/ws/dashboard/route.ts` and `admin/admin/src/lib/websocket-context.tsx`.

---

### **Part 3: Bot and Admin Panel Robustness**

**Goal:** Improve error handling and add missing UI features to make the system more resilient and manageable.

-   [ ] **Task 3.1: Implement Dead-Letter Queue Viewer**
    -   [ ] **Action:** Create a new page component file: `admin/admin/src/app/dashboard/errors/page.tsx`.
    -   [ ] **Action:** This page should fetch all records from the `DeadLetterQueue` table in the database.
    -   [ ] **Action:** Use the existing `Table` UI component to display the failed events, showing the `errorMessage`, `action`, `details`, and `timestamp`.
    -   [ ] **Action:** Add a link to this new "Error Queue" page in the `Sidebar` component (`admin/admin/src/components/ui/sidebar.tsx`).

-   [ ] **Task 3.2: Enhance Bot Media Handling**
    -   [ ] **Action:** Open `bot/instagram_bot.py`.
    -   [ ] **Action:** In the `send_dm` function, before uploading, check the file extension of the `media_url`.
    -   [ ] **Action:** If the extension is `.mp4`, `.mov`, etc., use `self.client.video_upload_from_url(...)`. Otherwise, use `photo_upload_from_url`. Add specific logging for each case.

---

### **Part 4: Testing and Quality Assurance**

**Goal:** Complete the test suite to ensure code quality and prevent regressions.

-   [x] **Task 4.1: Implement `EditTriggerForm` Tests**
    -   *(Verified as complete in previous analysis)*.

-   [ ] **Task 4.2: Add Test Coverage for Template CRUD**
    -   [ ] **Action:** Create a new test file: `admin/admin/cypress/e2e/template_crud.spec.ts`.
    -   [ ] **Action:** Write a Cypress E2E test that mimics the `trigger_crud.spec.ts` flow for the templates page, covering create, edit, and delete functionality.