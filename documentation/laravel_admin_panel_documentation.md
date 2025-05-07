# Laravel Admin Panel: AI-Friendly Overview and Actionable Steps

This document provides an AI-friendly overview and outlines actionable steps for building a separate admin panel using the Laravel framework, PostgreSQL database, Blade templating engine, and Livewire for dynamic components. The purpose of this panel is to enable administrators to manage Instagram post triggers, linking keywords to specific Instagram posts and defining automated direct messages (DMs) for the bot.

The admin panel will function as a distinct application from the core bot webhook (`webhook_server.py`). Both applications will share and interact with a single PostgreSQL database to manage trigger data.

## 1. Architectural Components

The system is composed of two primary, independent applications:

*   **1.1. Admin Panel (Laravel):**
    *   **Function:** Web interface for administrators.
    *   **Core Task:** Perform CRUD operations on `PostTrigger` data.
    *   **Technology:** Laravel (PHP), Blade, Livewire.
*   **1.2. Webhook Service (Python):**
    *   **Function:** Background process for real-time event handling.
    *   **Core Task:** Receive Instagram comments via webhooks, look up triggers in the database, and send DMs via the Instagram API.
    *   **Technology:** Python (with a PostgreSQL client library).

## 2. Technology Stack Details

*   **2.1. Laravel (PHP Framework):** Provides the foundational structure for the web application, including routing, MVC architecture, and backend logic.
*   **2.2. PostgreSQL (Database):** A relational database system required for persistent storage of `PostTrigger` data.
*   **2.3. Blade (Templating Engine):** Laravel's default templating engine for defining the structure of web pages.
*   **2.4. Livewire (Full-Stack Framework):** Used to build dynamic user interfaces with minimal JavaScript, handling front-end interactions via server-side PHP.

## 3. Database Schema

A single table is required in the PostgreSQL database to store trigger information:

*   **Table Name:** `post_triggers`
*   **Columns:**
    *   `id`: Primary Key, Auto-incrementing Integer.
    *   `instagram_post_id`: String, Stores the unique identifier of the Instagram post. Indexed for efficient lookups.
    *   `keyword`: String, Stores the specific keyword that triggers the DM.
    *   `dm_message`: Text, Stores the content of the direct message to be sent.
    *   `is_active`: Boolean, Default: `TRUE`. Indicates if the trigger is currently active.
    *   `created_at`: Timestamp, Automatically managed by Laravel.
    *   `updated_at`: Timestamp, Automatically managed by Laravel.

## 4. Actionable Implementation Steps (High-Level)

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
    *   Define web routes in `routes/web.php` to map URLs to the Livewire components or relevant controllers.
*   **Step 4.6. Database Integration for Webhook:**
    *   Ensure the Python webhook service has the necessary PostgreSQL client library (`psycopg2`).
    *   Modify the webhook code to connect to the same PostgreSQL database.
    *   Implement logic in the webhook to query the `post_triggers` table based on incoming Instagram comment data.

## 5. Integration Point

The key integration point between the Admin Panel and the Webhook Service is the **shared PostgreSQL database**. The Admin Panel writes to and updates the `post_triggers` table, while the Webhook Service reads from it to determine if a DM should be sent.

## 6. Deployment Consideration

Both the Laravel Admin Panel and the Python Webhook Service should be deployed as separate applications, ensuring they can both securely access the shared PostgreSQL database.

This document provides the necessary structure and high-level steps for an AI to proceed with the detailed implementation planning and subsequent development of the Laravel admin panel.
