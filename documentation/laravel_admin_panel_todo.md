# Laravel Admin Panel: Detailed To-Do Plan

This document provides a detailed, step-by-step plan for implementing the Laravel-based admin panel for managing Instagram post triggers. This plan expands upon the high-level overview and is designed to guide the autonomous development process.

## 1. Project Setup

*   [ ] **1.1. Create New Laravel Project:**
    *   [x] Execute `composer create-project --prefer-dist laravel/laravel [project-name]` in the desired directory (e.g., `admin_panel`).
    *   [x] Navigate into the newly created project directory.
*   [ ] **1.2. Configure Environment Variables:**
    *   [x] Copy `.env.example` to `.env`.
    *   [ ] Update the `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` variables in `.env` to connect to the PostgreSQL database.
    *   [ ] Ensure `APP_KEY` is set (usually generated automatically).
*   [ ] **1.3. Install Livewire:**
    *   [ ] Execute `composer require livewire/livewire`.
    *   [ ] Execute `php artisan livewire:install`.

## 2. Database Migration

*   [ ] **2.1. Create Migration File:**
    *   [ ] Execute `php artisan make:migration create_post_triggers_table --create=post_triggers`.
*   [ ] **2.2. Define Table Schema:**
    *   [ ] Open the generated migration file in `database/migrations/`.
    *   [ ] In the `up()` method, define the `post_triggers` table with the following columns:
        *   `$table->id();`
        *   `$table->string('instagram_post_id')->index();`
        *   `$table->string('keyword');`
        *   `$table->text('dm_message');`
        *   `$table->boolean('is_active')->default(true);`
        *   `$table->timestamps();`
*   [ ] **2.3. Run Migrations:**
    *   [ ] Execute `php artisan migrate`.

## 3. Eloquent Model

*   [ ] **3.1. Create Model File:**
    *   [ ] Execute `php artisan make:model PostTrigger`.
*   [ ] **3.2. Define Fillable Properties:**
    *   [ ] Open the `app/Models/PostTrigger.php` file.
    *   [ ] Add the `$fillable` property to allow mass assignment for the relevant columns:
        ```php
        protected $fillable = [
            'instagram_post_id',
            'keyword',
            'dm_message',
            'is_active',
        ];
        ```

## 4. Admin Interface (Livewire Components)

*   [ ] **4.1. Create Livewire Components:**
    *   [ ] Execute `php artisan make:livewire TriggerList`.
    *   [ ] Execute `php artisan make:livewire CreateTrigger`.
    *   [ ] Execute `php artisan make:livewire EditTrigger`.
*   [ ] **4.2. Implement `TriggerList` Component:**
    *   [ ] **PHP Class (`app/Http/Livewire/TriggerList.php`):**
        *   [ ] Add a public property to hold the list of triggers (e.g., `$triggers`).
        *   [ ] In the `mount()` or `render()` method, fetch all `PostTrigger` records from the database.
        *   [ ] Implement methods for deleting a trigger (e.g., `deleteTrigger($triggerId)`).
    *   [ ] **Blade View (`resources/views/livewire/trigger-list.blade.php`):**
        *   [ ] Loop through the `$triggers` and display them in a table or list format.
        *   [ ] Include buttons/links for editing and deleting each trigger, using Livewire actions (e.g., `wire:click="deleteTrigger({{ $trigger->id }})"`).
        *   [ ] Add a link or button to navigate to the create trigger page.
*   [ ] **4.3. Implement `CreateTrigger` Component:**
    *   [ ] **PHP Class (`app/Http/Livewire/CreateTrigger.php`):**
        *   [ ] Add public properties for form inputs (e.g., `$instagram_post_id`, `$keyword`, `$dm_message`, `$is_active`).
        *   [ ] Implement a `submitForm()` method to validate the input data.
        *   [ ] If validation passes, create a new `PostTrigger` record using the model.
        *   [ ] Redirect the user back to the trigger list page after successful creation.
    *   [ ] **Blade View (`resources/views/livewire/create-trigger.blade.php`):**
        *   [ ] Create an HTML form with input fields for `instagram_post_id`, `keyword`, `dm_message`, and a checkbox for `is_active`.
        *   [ ] Bind the input fields to the Livewire component properties using `wire:model`.
        *   [ ] Add a submit button with `wire:click="submitForm"`.
        *   [ ] Include validation error messages using Blade directives (`@error`).
*   [ ] **4.4. Implement `EditTrigger` Component:**
    *   [ ] **PHP Class (`app/Http/Livewire/EditTrigger.php`):**
        *   [ ] Add a public property for the trigger ID (e.g., `$triggerId`).
        *   [ ] Add public properties for form inputs (e.g., `$instagram_post_id`, `$keyword`, `$dm_message`, `$is_active`).
        *   [ ] In the `mount()` method, fetch the `PostTrigger` record based on `$triggerId` and populate the form input properties.
        *   [ ] Implement an `updateForm()` method to validate the input data.
        *   [ ] If validation passes, update the existing `PostTrigger` record.
        *   [ ] Redirect the user back to the trigger list page after successful update.
    *   [ ] **Blade View (`resources/views/livewire/edit-trigger.blade.php`):**
        *   [ ] Create an HTML form similar to the create form, pre-populated with the existing trigger data.
        *   [ ] Bind input fields using `wire:model`.
        *   [ ] Add an update button with `wire:click="updateForm"`.
        *   [ ] Include validation error messages.

## 5. Routing

*   [ ] **5.1. Define Web Routes:**
    *   [ ] Open `routes/web.php`.
    *   [ ] Define routes to map URLs to your Livewire components:
        ```php
        use Illuminate\Support\Facades\Route;
        use App\Http\Livewire\TriggerList;
        use App\Http\Livewire\CreateTrigger;
        use App\Http\Livewire\EditTrigger;

        Route::get('/admin/triggers', TriggerList::class)->name('admin.triggers.index');
        Route::get('/admin/triggers/create', CreateTrigger::class)->name('admin.triggers.create');
        Route::get('/admin/triggers/{trigger}/edit', EditTrigger::class)->name('admin.triggers.edit');
        ```
    *   [ ] (Optional) Add basic authentication middleware to protect these routes.

## 6. Basic UI Layout

*   [ ] **6.1. Create a Layout File:**
    *   [ ] Create a master layout Blade file (e.g., `resources/views/layouts/admin.blade.php`).
    *   [ ] Include necessary HTML structure, Livewire styles and scripts (`@livewireStyles`, `@livewireScripts`), and a placeholder for content (`@yield('content')`).
*   [ ] **6.2. Extend Layout in Component Views:**
    *   [ ] In your Livewire component Blade views (`.blade.php` files), extend the master layout:
        ```blade
        @extends('layouts.admin')

        @section('content')
            {{-- Component content here --}}
        @endsection
        ```

## 7. Integrate Webhook Database Access (Conceptual)

*   [ ] **7.1. Install PostgreSQL Client in Python:**
    *   [ ] In your webhook project, execute `pip install psycopg2-binary`.
*   [ ] **7.2. Update Webhook Database Connection:**
    *   [ ] Modify `webhook_server.py` to establish a connection to the same PostgreSQL database using `psycopg2`.
    *   [ ] Ensure database credentials are loaded securely (e.g., from environment variables or a separate config file).
*   [ ] **7.3. Implement Trigger Lookup Logic:**
    *   [ ] Write a function in `webhook_server.py` to query the `post_triggers` table based on the Instagram post ID and comment text.
    *   [ ] Use SQL queries to find an active trigger where the comment text contains the keyword (using `LIKE` or `ILIKE`).
    *   [ ] Retrieve the `dm_message` if a match is found.

## 8. Testing

*   [ ] **8.1. Run Laravel Development Server:**
    *   [ ] Execute `php artisan serve` in the admin panel project directory.
    *   [ ] Access the admin panel in a web browser (usually `http://127.0.0.1:8000/admin/triggers`).
*   [ ] **8.2. Test CRUD Operations:**
    *   [ ] Use the admin interface to create, view, edit, and delete triggers.
*   [ ] **8.3. Test Webhook Integration (Requires Instagram Setup):**
    *   [ ] Ensure the webhook service is running and accessible to Instagram.
    *   [ ] Create a test post on Instagram.
    *   [ ] Use the admin panel to create a trigger for that test post with a specific keyword and DM message.
    *   [ ] Comment on the Instagram test post with the trigger keyword.
    *   [ ] Verify that the webhook processes the comment and sends the correct DM.

This detailed plan provides a roadmap for implementing the Laravel admin panel and integrating it with the existing Python webhook via the shared PostgreSQL database.
