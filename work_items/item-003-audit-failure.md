# Work Item 003: Audit Failure - Critical Gaps in Core Features

**Priority:** Critical
**Status:** Open

## Audit Finding
The implementation does not meet the canonical specification. The following critical gaps were identified:

1.  **Missing Trigger Management UI:** The admin panel lacks the user interface for creating, reading, updating, and deleting triggers. The feature is unusable by an administrator.
2.  **Non-Functional Media DMs:** The Python bot's code to send DMs with media is a placeholder and does not correctly use the Instagram API library to upload and send photos or videos.
3.  **Incomplete Testing Phase:** The project plan's testing phase is unfinished. The CI pipeline does not run tests for the Next.js admin panel, only for the Python bot.

## Required Actions
1.  **Implement Trigger UI:** Build out the React components in `admin/admin/src/app/dashboard/triggers/page.tsx` to provide full CRUD functionality, connecting to the existing API endpoints. This should be similar in quality to the Template Management page.
2.  **Fix Bot Media Sending:** Replace the placeholder `requests` logic in `instagram_bot/instagram_bot.py` with the correct `instagrapi` methods for sending media attachments in DMs.
3.  **Complete Testing Setup:**
    *   Mark the testing tasks in `work_breakdown/master_plan.md` as the active plan.
    *   Ensure both Python (`pytest`) and Node.js (`npm test`) tests are executed in the CI pipeline on all relevant pushes and pull requests.
    *   Add tests for the newly created Trigger UI.