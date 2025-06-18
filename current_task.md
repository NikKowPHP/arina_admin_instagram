# Current Task: Fix Critical Data-Fetching Bugs in Analytics Dashboard

## Task Description
Fix the data-fetching bugs in the analytics dashboard that are causing server crashes. The issues are:
1. The `getDashboardAnalytics` function attempts to query fields that don't exist in the Prisma schema
2. The user activity query filters by a non-existent `lastLogin` field
3. The template usage query selects a non-existent `name` field

## Step-by-Step Plan

1. **Examine the Current Code**
   - Read the `getDashboardAnalytics` function in `admin/admin/src/lib/actions.ts`

2. **Fix the User Activity Query**
   - Replace the `lastLogin` field with an existing field or remove the metric
   - Use recent entries in `activity_log` as an alternative metric for active users

3. **Fix the Template Usage Query**
   - Replace the `name` field with the existing `content` or `id` field

4. **Test the Dashboard**
   - Verify that the dashboard page loads without crashing
   - Ensure the analytics charts display with the corrected data

5. **Finalize and Commit**
   - Mark task as complete in the plan file
   - Create `COMMIT_COMPLETE.md` signal file
   - Handoff to orchestrator