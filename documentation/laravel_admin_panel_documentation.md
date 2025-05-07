# Laravel Admin Panel: AI-Friendly Overview and Actionable Steps

This document provides an AI-friendly overview and outlines actionable steps for building a separate admin panel using the Laravel framework, PostgreSQL database, Blade templating engine, and Livewire for dynamic components. The purpose of this panel is to enable administrators to manage Instagram post triggers, linking keywords to specific Instagram posts and defining automated direct messages (DMs) for the bot.

The admin panel will function as a distinct application from the core bot webhook (`webhook_server.py`). Both applications will share and interact with a single PostgreSQL database to manage trigger data.

## 1. Architectural Components

The system is composed of two primary, independent applications:

*   **1.1. Admin Panel & Webhook Service (Laravel):**
    *   **Function:**
        *   Admin Panel: Web interface for administrators to perform CRUD operations on `PostTrigger` data.
        *   Webhook Service: Handles incoming Instagram webhook notifications (comments, messages), looks up triggers in the database, and sends DMs via the Instagram API.
    *   **Technology:** Laravel (PHP), Blade, Livewire, Guzzle (for API calls).
    *   **Key Controller for Webhook:** `App\Http\Controllers\InstagramWebhookController`.

## 2. Technology Stack Details

*   **2.1. Laravel (PHP Framework):** Provides the foundational structure for the web application, including routing, MVC architecture, and backend logic.
*   **2.2. PostgreSQL (Database):** A relational database system required for persistent storage of `PostTrigger` data.
*   **2.3. Blade (Templating Engine):** Laravel's default templating engine for defining the structure of web pages.
*   **2.4. Livewire (Full-Stack Framework):** Used to build dynamic user interfaces with minimal JavaScript, handling front-end interactions via server-side PHP.

## 3. Environment Setup with Docker Compose

The application environment, including the PHP application server, Nginx web server, PostgreSQL database, and Redis cache, can be easily set up using the provided `docker-compose.yml` file.

1.  **Copy Environment File:** Copy the `.env.example` file to `.env` in the project root.
2.  **Configure .env:** Update the `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` variables in the `.env` file to match the PostgreSQL service configuration in `docker-compose.yml`. The default values in `docker-compose.yml` are:
    *   `DB_CONNECTION=pgsql`
    *   `DB_HOST=db`
    *   `DB_PORT=5432`
    *   `DB_DATABASE=huberman_db`
    *   `DB_USERNAME=sail`
    *   `DB_PASSWORD=password`
    Ensure these match or update them in your `.env` file if you've customized the docker compose configuration.
3.  **Build and Run:** From the project root, run the following command to build the images and start the containers in detached mode:
    ```bash
    docker compose up -d
    ```
4.  **Access the Application:** The application will be accessible via the port specified in the `APP_PORT` variable in your `.env` file (default is 8000).

## 4. Database Schema

A single table is required in the PostgreSQL database to store trigger information:

*   **Table Name:** `post_triggers`
*   **Columns:**
    *   `id`: Primary Key, Auto-incrementing Integer.
    *   `instagram_post_id`: String, Stores the unique identifier of the Instagram post. Indexed for efficient lookups.
    *   `keyword`: String, Stores the specific keyword that triggers the DM.
    *   `dm_message`: Text, Stores a JSON object containing structured data for the direct message (e.g., `media_url`, `media_type`, `description_text`, `cta_text`, `cta_url`).
    *   `is_active`: Boolean, Default: `TRUE`. Indicates if the trigger is currently active.
    *   `created_at`: Timestamp, Automatically managed by Laravel.
    *   `updated_at`: Timestamp, Automatically managed by Laravel.

## 5. Actionable Implementation Steps (High-Level)

The following steps outline the high-level process for building the Laravel admin panel:

*   **Step 4.1. Project Setup:**
    *   Create a new Laravel project.
    *   Configure the `.env` file for PostgreSQL database connection.
    *   Install Livewire.
*   **Step 4.2. Database Migration:**
    *   Create a Laravel migration file for the `post_triggers` table.
    *   Define the schema for the `post_triggers` table as specified in Section 3.
    *   Run the database migration.
*   **Step 4.3. Eloquent Model:**
    *   Create an Eloquent model named `PostTrigger` to represent the `post_triggers` table.
    *   Define the `$fillable` properties in the model.
*   **Step 4.4. Admin Interface Components (Livewire):**
    *   Create Livewire components for managing triggers (e.g., `TriggerList`, `CreateTrigger`, `EditTrigger`).
    *   Implement the logic within these components to interact with the `PostTrigger` model for CRUD operations.
    *   Develop the associated Blade views for each Livewire component to define the user interface.
*   **Step 4.5. Routing:**
    *   Define web routes in `routes/web.php` for the admin panel Livewire components.
    *   Define API routes in `routes/api.php` for the Instagram webhook endpoint, pointing to `InstagramWebhookController`.
*   **Step 4.6. Webhook Logic (InstagramWebhookController):**
    *   Implement webhook verification (`verify` method).
    *   Implement event handling (`handle` method):
        *   Verify webhook signature.
        *   Parse incoming payload (comment data, user ID, media ID).
        *   Query `PostTrigger` model based on `instagram_post_id` and `keyword` from the comment.
        *   Retrieve structured `dm_message` content.
        *   Call a method (e.g., `sendConfiguredDm`) to send the DM using the Instagram Graph API (via Guzzle).

## 6. Integration Point & Data Flow

*   **Admin Panel:** Administrators use the web interface (Livewire components) to create, read, update, and delete `PostTrigger` records in the PostgreSQL database. This includes defining the `instagram_post_id`, `keyword`, and the structured `dm_message` (media, description, CTA).
*   **Webhook Service (`InstagramWebhookController`):**
    1.  Receives event notifications from Instagram.
    2.  Reads from the `post_triggers` table in the PostgreSQL database to find matching active triggers.
    3.  Uses the structured `dm_message` from the found trigger to compose and send a DM via the Instagram Graph API.
*   The **shared PostgreSQL database** remains the central integration point.

## 7. Deployment Consideration

The Laravel application, which now includes both the Admin Panel and the Instagram Webhook Service, should be deployed to a server environment that supports PHP and can handle incoming HTTPS requests for the webhook. The application must have secure access to the PostgreSQL database and be able to make outbound HTTPS requests to the Instagram Graph API.

This document provides the necessary structure and high-level steps for an AI to proceed with the detailed implementation planning and subsequent development of the Laravel admin panel.
