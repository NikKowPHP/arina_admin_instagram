Hello @roo,
We are adopting a more direct approach for task execution. Your primary role is to implement the provided tasks based on the detailed specifications I will give you.
Your Task Processing Model:
When I provide you with a task (e.g., "Task X.Y: Implement Feature Z"), typically from a Markdown list:
Acknowledge Receipt (Briefly): A simple "Understood. Starting Task X.Y: Implement Feature Z." is sufficient.
Direct Implementation:
The task I provide will contain:
A clear Objective.
A list of Affected Files/Components that you will need to create or modify.
Specific Implementation Steps (often as sub-task checkboxes or numbered lists within the Markdown).
Your primary job is to directly translate these steps into code within the specified files.
Assume the provided plan is complete and correct. The detailed breakdown, component identification, and implementation strategy are embedded within the task description I give you.
Code Generation:
Generate the necessary code for each affected file and implementation step as outlined.
Work through any sub-task checkboxes ([ ]) provided within the main task, aiming to complete them.
Minimize Questions & Pre-Analysis:
Do not perform extensive pre-analysis.
Proceed directly to implementation.
Only ask a question if a task description contains a critical ambiguity or a direct contradiction that makes implementation impossible.
Reporting Completion & Updating Task List:
Once all implementation steps for the given task are completed, report back.
State clearly: "Task X.Y: Implement Feature Z - Complete."
List the primary files you created or significantly modified to complete the task.
Crucially, if I provided the task(s) as part of a Markdown list in my prompt, you must reproduce the entire Markdown list I just gave you, but with the main checkbox for the completed task marked as [x]. If the task included sub-step checkboxes ([ ]), also mark those as [x] upon their completion.
Example Interaction:
Me (Input - I'm providing a "phase" or "chunk" of my TODO list):
Okay @roo, please work on the account deletion feature. Here's the relevant part of the plan:

- [ ] **Task 2.4: Add User Preferences Screen**
    *   Objective: Basic screen for future settings.
- [ ] **Task 2.5: Implement Account Deletion**
    *   **Objective:** Allow users to delete their account.
    *   **Affected Flutter Files:**
        *   Flutter Profile settings UI (e.g., `profile_settings_page.dart`)
        *   `lib/core/user/user_service.dart`
        *   `lib/core/auth/supabase_auth_helper.dart` (for client-side sign out)
    *   **Implementation Steps:**
        1.  **Add `deleteAccount` to Flutter `UserService`:**
            *   [ ] Create method: `Future<void> deleteAccount()`.
            *   [ ] Inside, use `ApiClient` to make a `DELETE` request to `/profile/`.
        2.  **Implement UI for Account Deletion (Flutter):**
            *   [ ] Add a "Delete Account" button in `profile_settings_page.dart`.
            *   [ ] Show a confirmation dialog before proceeding.
            *   [ ] On confirmation, call `await userService.deleteAccount()`.
        3.  **Handle Post-Deletion Flow (Flutter):**
            *   [ ] After a successful `DELETE` API call from `UserService.deleteAccount()`:
                *   [ ] Call `await _authHelper.signOut()` (from `SupabaseAuthHelper`).
                *   [ ] The `onAuthStateChange` listener in `UserProvider` should then handle clearing local app state and navigating to the login screen.
- [ ] **Task 2.6: Implement Profile Picture Upload**
    *   Objective: Allow users to upload a profile picture.

@roo (Expected Response after implementing Task 2.5):
Understood. Starting Task 2.5: Implement Account Deletion.

Task 2.5: Implement Account Deletion - Complete.

Files created/modified:
- `lib/core/user/user_service.dart` (added deleteAccount method)
- `lib/ui/profile/profile_settings_page.dart` (added delete account button and dialog)
- (No changes needed in `supabase_auth_helper.dart` as it was only for calling signOut)

Updated task list from your prompt:
- [ ] **Task 2.4: Add User Preferences Screen**
    *   Objective: Basic screen for future settings.
- [x] **Task 2.5: Implement Account Deletion**
    *   **Objective:** Allow users to delete their account.
    *   **Affected Flutter Files:**
        *   Flutter Profile settings UI (e.g., `profile_settings_page.dart`)
        *   `lib/core/user/user_service.dart`
        *   `lib/core/auth/supabase_auth_helper.dart` (for client-side sign out)
    *   **Implementation Steps:**
        1.  **Add `deleteAccount` to Flutter `UserService`:**
            *   [x] Create method: `Future<void> deleteAccount()`.
            *   [x] Inside, use `ApiClient` to make a `DELETE` request to `/profile/`.
        2.  **Implement UI for Account Deletion (Flutter):**
            *   [x] Add a "Delete Account" button in `profile_settings_page.dart`.
            *   [x] Show a confirmation dialog before proceeding.
            *   [x] On confirmation, call `await userService.deleteAccount()`.
        3.  **Handle Post-Deletion Flow (Flutter):**
            *   [x] After a successful `DELETE` API call from `UserService.deleteAccount()`:
                *   [x] Call `await _authHelper.signOut()` (from `SupabaseAuthHelper`).
                *   [x] The `onAuthStateChange` listener in `UserProvider` should then handle clearing local app state and navigating to the login screen.
- [ ] **Task 2.6: Implement Profile Picture Upload**
    *   Objective: Allow users to upload a profile picture.%     