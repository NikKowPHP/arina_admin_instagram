# Laravel Admin Panel: Detailed To-Do Plan

This document provides a detailed, step-by-step plan for implementing the Laravel-based admin panel for managing Instagram post triggers and the integrated Instagram bot. This plan incorporates feedback and outlines current and future tasks.

## 0. Clarifications & Confirmations

*   [ ] **0.1. Clarify CTA Behavior:** — @cline
    *   [ ] The current plan is for the DM's CTA to directly link to the Telegram post (e.g., via a `web_url` button or an embedded link). If the requirement "cta click sends *another message* with the link" is a strict necessity, this implies a two-step DM process (e.g., using postback buttons and handling `messaging_postbacks`). This would require significant changes to the `dm_message` structure, admin forms, and webhook controller logic. **Please confirm if the single DM with a direct link CTA is the correct immediate goal.**

## 1. Project Setup

*   [x] **1.1. Create New Laravel Project:** — @cline
    *   [x] Execute `composer create-project --prefer-dist laravel/laravel [project-name]`
    *   [x] Navigate into the newly created project directory.
*   [x] **1.2. Configure Environment with Docker Compose:** — @cline
    *   [x] Environment configuration, including the database connection, is managed via the `docker-compose.yml` file. Ensure your `.env` file is copied from `.env.example` and the database variables match the docker compose configuration.
*   [x] **1.3. Start Docker Containers:** — @cline
    *   [x] Execute `docker compose up -d` to build and run the environment containers.
*   [x] **1.4. Install Livewire:** — @cline
    *   [x] Execute `docker compose exec app composer require livewire/livewire`
    *   [x] Execute `docker compose exec app php artisan livewire:install`

## 2. Database Migration

*   [x] **2.1. Create Migration File for `post_triggers`:** — @cline
    *   [x] Execute `php artisan make:migration create_post_triggers_table --create=post_triggers`.
*   [x] **2.2. Define `post_triggers` Table Schema:** — @cline
    *   [x] Open the generated migration file in `database/migrations/`.
    *   [x] In the `up()` method, define the `post_triggers` table with: `id`, `instagram_post_id`, `keyword`, `dm_message` (TEXT), `is_active`, `timestamps`.
*   [x] **2.3. Run Migrations:** — @cline
    *   [x] Execute `php artisan migrate`.

## 3. Eloquent Model (`PostTrigger`)

*   [x] **3.1. Create Model File:** — @cline
    *   [x] Execute `php artisan make:model PostTrigger`.
*   [x] **3.2. Define Fillable Properties:** — @cline
    *   [x] Open `app/Models/PostTrigger.php`.
    *   [x] Add `$fillable` for `instagram_post_id`, `keyword`, `dm_message`, `is_active`.

## 4. Admin Interface (Livewire Components - Basic CRUD)

*   [x] **4.1. Create Livewire Components:** — @cline
    *   [x] Execute `php artisan make:livewire TriggerList`.
    *   [x] Execute `php artisan make:livewire CreateTrigger`.
    *   [x] Execute `php artisan make:livewire EditTrigger`.
*   [x] **4.2. Implement `TriggerList` Component:** — @cline
    *   [x] **PHP Class:** Fetch triggers, implement delete.
    *   [x] **Blade View:** Display triggers, add edit/delete buttons, link to create.
*   [x] **4.3. Implement `CreateTrigger` Component:** — @cline
    *   [x] **PHP Class:** Properties for form inputs, validation, create record, redirect.
    *   [x] **Blade View:** Form with inputs, bind to properties, submit button, validation errors.
*   [x] **4.4. Implement `EditTrigger` Component:** — @cline
    *   [x] **PHP Class:** Fetch record, properties for inputs, validation, update record, redirect.
    *   [x] **Blade View:** Form pre-populated, bind inputs, update button, validation errors.

## 5. Routing (Admin Panel)

*   [x] **5.1. Define Web Routes:** — @cline
    *   [x] Open `routes/web.php`.
    *   [x] Define routes for `TriggerList`, `CreateTrigger`, `EditTrigger`.

## 6. Basic UI Layout (Admin Panel)

*   [x] **6.1. Create a Layout File:** — @cline
    *   [x] Create `resources/views/layouts/admin.blade.php`.
    *   [x] Include HTML structure, `@livewireStyles`, `@livewireScripts`, `@yield('content')`.
*   [x] **6.2. Extend Layout in Component Views:** — @cline
    *   [x] Use `@extends('layouts.admin')` in Livewire component views.

## 7. `PostTrigger` Model & Migration Enhancements (Rich DM Content)

*   [x] **7.1. Configure `dm_message` for Structured Data (JSON Approach):**
    *   [x] Ensure `dm_message` column in `create_post_triggers_table` migration is `TEXT` (already is).
    *   [x] In `app/Models/PostTrigger.php`, add Eloquent cast for `dm_message` to `array`:
        ```php
        protected $casts = [
            'dm_message' => 'array', // or AsArrayObject::class
            'is_active' => 'boolean',
        ];
        ```
        (Ensure `$fillable` remains appropriate if `dm_message` itself is being filled directly with an array).
*   [x] **7.2. Update Admin Forms for Rich DM Content (`CreateTrigger`, `EditTrigger`):**
    *   [x] In `CreateTrigger.php` and `EditTrigger.php` Livewire components:
        *   [x] Add public properties for: `$media_url`, `$media_type`, `$description_text`, `$cta_text`, `$cta_url`.
        *   [x] Update validation rules for these new fields (e.g., `url` for URLs, `nullable`, `string`, etc.).
        *   [x] Logic to combine these separate form fields into an array/JSON structure and store it in the `dm_message` property before saving the `PostTrigger` model.
        *   [x] When editing (`EditTrigger.php` `mount()` method), parse the `dm_message` (if it's an array/JSON) to populate these separate form field properties.
    *   [x] In `resources/views/livewire/create-trigger.blade.php` and `edit-trigger.blade.php`:
        *   [x] Add input fields for `media_url` (text), `media_type` (e.g., dropdown: image, video, or text input), `description_text` (textarea), `cta_text` (text), `cta_url` (text). Bind them to the new Livewire properties.

## 8. Instagram Bot Logic (in `InstagramWebhookController.php`)

*   [x] **8.1. Refactor `handle()` method to use Database Triggers:**
    *   [x] Remove reliance on `.env` variables like `TARGET_INSTAGRAM_POST_ID` and `TRIGGER_KEYWORD` for core trigger logic.
    *   [x] After extracting `mediaId` (from webhook, e.g., `entry[0].changes[0].value.media.id` or `entry[0].changes[0].value.post.id` for comments on posts; `entry[0].messaging[0].message.reply_to.story.id` for story replies) and `commentText` (e.g. `entry[0].changes[0].value.text`):
        *   Query the `PostTrigger` model:
            ```php
            $triggers = PostTrigger::where('instagram_post_id', $mediaId)
                                ->where('is_active', true)
                                ->get();

            foreach ($triggers as $trigger) {
                // Ensure keyword matching is case-insensitive and handles partial matches if needed
                if (str_contains(strtolower($commentText), strtolower($trigger->keyword))) {
                    // Keyword matched for this trigger
                    $commenterId = $payload['entry'][0]['changes'][0]['value']['from']['id']; // Adjust path as needed
                    $this->sendConfiguredDm($commenterId, $trigger); // Pass the whole trigger
                    // Decide if multiple keyword matches on one comment should send multiple DMs or break;
                    break;
                }
            }
            ```
    *   [x] Handle other fields like 'messaging' for story replies if needed later.
*   [x] **8.2. Create/Modify `sendConfiguredDm(string $recipientId, PostTrigger $trigger)` method:**
    *   [x] This method should accept the `$recipientId` and the `$trigger` (PostTrigger model instance).
    *   [x] Fetch DM content from the `$trigger->dm_message` (which should be an array due to the cast):
        ```php
        // Inside sendConfiguredDm($recipientId, PostTrigger $trigger)
        $dmContent = $trigger->dm_message; // Already an array
        $mediaUrl = $dmContent['media_url'] ?? null;
        $mediaType = $dmContent['media_type'] ?? 'image'; // Default or derive
        $descriptionText = $dmContent['description_text'] ?? '';
        $ctaText = $dmContent['cta_text'] ?? 'Learn More';
        $ctaUrl = $dmContent['cta_url'] ?? null; // This will be the Telegram URL
        ```
    *   [x] Adapt the existing Guzzle call logic in the old `sendDm` method to use these variables to construct the message payload. **Strongly consider constructing a 'Generic Template' message payload (see Instagram Graph API documentation) if `media_url` is present in the trigger. This allows for an image/video display alongside a title (from `description_text`) and a `web_url` button (using `cta_text` and `cta_url`). If no `media_url` is provided, a text message with an embedded link (using `cta_text` and `cta_url`) or a text message with a `web_url` button can be sent.**
    *   [x] Ensure the CTA button points to the `$ctaUrl` (Telegram post URL).

## 9. Admin Panel Enhancements

*   [x] **9.1. Implement Authentication:** — @cline
    *   [x] Install Laravel Breeze or Jetstream: `php artisan breeze:install` (choose appropriate stack, e.g., Blade). Or implement custom auth. — @cline
    *   [x] Run migrations for auth tables: `php artisan migrate`. — @cline
    *   [x] Protect admin routes in `routes/web.php` with `auth` middleware:
        ```php
        Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
            Route::get('/triggers', TriggerList::class)->name('triggers.index');
            Route::get('/triggers/create', CreateTrigger::class)->name('triggers.create');
            Route::get('/triggers/{trigger}/edit', EditTrigger::class)->name('triggers.edit');
        });
        ```
        — @cline
*   [x] **9.2. UI/UX Improvements:** — @cline
    *   [x] **Styling:** Consistently apply Tailwind CSS classes to `admin.blade.php` and Livewire views for a professional look. — @cline
    *   [x] **Navigation:** Add a simple navigation bar in `layouts/admin.blade.php` (e.g., link to Triggers, Logout). — @cline
    *   [x] **Feedback Messages:** Style the `session()->flash('message')` display more effectively (e.g., using Tailwind alerts). — @cline
    *   [x] **Input Validation Messages:** Improve display of validation messages in forms. — @cline
    *   [x] **Pagination:** In `app/Livewire/TriggerList.php`, change `PostTrigger::all()` to `PostTrigger::latest()->paginate(15);`. Update `trigger-list.blade.php` to display pagination links (`{{ $triggers->links() }}`). — @cline
*   [x] **9.3. Advanced Input Validation:** — @cline
    *   [x] In Livewire components (`CreateTrigger`, `EditTrigger`), add more specific validation rules:
        *   `media_url`: `nullable|url`
        *   `media_type`: `nullable|string|in:image,video` (or other relevant types)
        *   `description_text`: `nullable|string`
        *   `cta_text`: `nullable|string|max:20` (Instagram CTA button text limit)
        *   `cta_url`: `nullable|url`
        *   `keyword`: `required|string|max:255`
        *   `instagram_post_id`: `required|string|max:255`
        — @cline

## 10. Environment Configuration

*   [x] **10.1. Update `.env.example` and `.env`:** — @cline
    *   [x] Add `INSTAGRAM_WEBHOOK_VERIFY_TOKEN` (used for webhook verification). — @cline
    *   [x] Add `FACEBOOK_APP_SECRET` (used for webhook signature verification). — @cline
    *   [x] Add `INSTAGRAM_PAGE_ACCESS_TOKEN` (used for sending DMs via Graph API). — @cline
    *   [x] Review and remove/deprecate old `.env` variables if they are no longer used by the bot's core logic (e.g., `TARGET_INSTAGRAM_POST_ID`, `TRIGGER_KEYWORD`, `MEDIA_URL`, `DESCRIPTION_TEXT`, `TELEGRAM_POST_URL` if they were for the static bot). — @cline

## 11. General Considerations & Future Enhancements

*   [x] **11.1. Error Handling & Logging:** — @cline
    *   [x] Enhance logging in `InstagramWebhookController` for API calls, database interactions, and unexpected webhook payloads. Use `Log::error()`, `Log::info()`. — @cline
*   [x] **11.2. Job Queues for Sending DMs (Recommended for Production):** — @cline
    *   [x] Create a Job (e.g., `SendInstagramDmJob`): `php artisan make:job SendInstagramDmJob`. — @cline
    *   [x] The job should accept necessary data (recipient ID, DM content details from the trigger).
    *   [x] Move the DM sending logic (Guzzle call) into the job's `handle()` method.
    *   [x] Dispatch this job from `InstagramWebhookController` instead of calling `sendConfiguredDm` directly: `SendInstagramDmJob::dispatch($commenterId, $trigger->dm_message);`. — @cline
    *   [ ] Configure and run queue workers: `php artisan queue:work`.
*   [ ] **11.3. API Versioning for Instagram Graph API:** — @cline
    *   [ ] Ensure Graph API calls use a specific version (e.g., `v19.0`) in the URL to avoid unexpected breaking changes.

## 12. Testing

*   [x] **12.1. Run Laravel Development Server:**
    *   [x] Execute `php artisan serve`.
    *   [x] Access admin panel: `http://127.0.0.1:8000/admin/triggers`.
*   [x] **12.2. Test Admin Panel CRUD Operations:**
    *   [x] Create, view, edit, and delete triggers, including the new rich DM content fields.
*   [ ] **12.3. Test Webhook Integration (Requires Instagram Setup & App Review for `instagram_manage_messages`):** — @cline
    *   [ ] Ensure webhook URL is correctly set up in Facebook Developer App and subscribed to the page.
    *   [ ] Create a test post on the linked Instagram page.
    *   [ ] Use the admin panel to create a trigger for that test post (correct `instagram_post_id`), a specific keyword, and DM content (including media, text, CTA).
    *   [ ] Comment on the Instagram test post with the trigger keyword.
    *   [ ] Verify:
        *   [ ] Webhook is received by `InstagramWebhookController`.
        *   [ ] Correct trigger is fetched from the database.
        *   [ ] Correct DM (with media, text, CTA) is sent to the commenter.
        *   [ ] Check logs for any errors.
*   [~] **12.4. Write Automated Tests:** — @cline
    *   [ ] **Feature Tests (Admin Panel):**
        *   [ ] Test authentication (login, redirect if not logged in).
        *   [ ] Test CRUD operations for triggers (e.g., `tests/Feature/Admin/TriggerManagementTest.php`).
    *   [ ] **Feature/Unit Tests (Webhook Controller):**
        *   [ ] Test webhook signature verification.
        *   [ ] Test webhook event processing (mock incoming webhook data).
        *   [ ] Test trigger lookup logic (mock `PostTrigger` model).
        *   [ ] Test DM sending logic (mock Guzzle HTTP client and Graph API calls).
        (e.g., `tests/Feature/Webhook/InstagramWebhookTest.php`)
    *   [x] Created test files: `tests/Feature/Admin/TriggerManagementTest.php` and `tests/Feature/Webhook/InstagramWebhookTest.php`.

This updated plan should provide a clear roadmap for the next development phase.
