# Instagram Bot Webhook Documentation

This document provides documentation for the Laravel implementation of the Instagram webhook handler and bot logic. Its primary function is to receive real-time comment notifications from Instagram via webhooks and trigger automated direct messages (DMs) based on predefined triggers stored in a PostgreSQL database.

## 1. Purpose

The webhook service, implemented in `app/Http/Controllers/InstagramWebhookController.php`, acts as the bridge between the Instagram platform and the bot's DM sending capability. It listens for specific events (like comments on a post or story replies) and initiates the automated response process based on triggers defined in the `post_triggers` database table.

## 2. Webhook Endpoint

*   **URL:** Configured in the Facebook Developer App, pointing to the Laravel application's API route (e.g., `https://your-app-domain.com/api/webhook/instagram`).
*   **Method:** `GET` (for webhook verification) and `POST` (for event notifications).
*   **Controller:** `App\Http\Controllers\InstagramWebhookController`
    *   `verify()`: Handles `GET` requests for `hub.mode=subscribe` verification.
    *   `handle()`: Handles `POST` requests with event data.

## 3. Instagram Webhook Payload (Comments & Other Events)

When an event occurs (e.g., a user comments on a subscribed Instagram post), Instagram sends a `POST` request to your configured webhook URL. The request body contains a JSON payload. Key relevant fields for a **comment** event (`entry[0].changes[0].field == 'comments'`) typically include:

*   `object`: Type of object (e.g., "instagram").
*   `entry`: An array of entries.
    *   `id`: Page ID.
    *   `time`: Timestamp of the update.
    *   `changes`: An array of changes.
        *   `field`: The type of change (e.g., "comments").
        *   `value`: An object containing details about the comment.
            *   `id`: The comment ID (e.g., `entry[0].changes[0].value.id`).
            *   `from`: An object with the user's Instagram Scoped ID (IGSID) and username who made the comment (e.g., `entry[0].changes[0].value.from.id`).
            *   `media`: An object with the media (post) ID (e.g., `entry[0].changes[0].value.media.id`).
            *   `text`: The content of the comment (e.g., `entry[0].changes[0].value.text`).
            *   `timestamp`: Timestamp of the comment.
            *   `parent_id`: (If it's a reply to another comment).

The `handle()` method in `InstagramWebhookController` parses this JSON payload to extract the `media.id` (or equivalent for other event types like story replies), the `text` of the comment/message, and the commenter's/sender's IGSID.

## 4. Expected Webhook Response

Upon successful receipt and processing of the webhook payload, the webhook endpoint should return:

*   **HTTP Status Code:** `200 OK`

This signals to Instagram that the notification was received successfully.

## 5. Internal Logic Flow (Laravel Implementation)

When the Laravel application receives a POST request from the Instagram webhook:

1.  **Receive and Parse Payload:** A dedicated route and controller method receive the JSON payload and parse it to extract relevant information, particularly the Instagram `post_id`, the `comment_text`, and the commenting `user_id`.
2.  **Verify Signature:** The `handle()` method verifies the `X-Hub-Signature-256` header using the `FACEBOOK_APP_SECRET` environment variable.
3.  **Database Lookup for Triggers:**
    *   The controller queries the `PostTrigger` model (`App\Models\PostTrigger`).
    *   It searches for active triggers (`is_active = true`) where `instagram_post_id` matches the `media.id` from the webhook.
    *   It iterates through these triggers and checks if the comment `text` (case-insensitively) contains the trigger's `keyword`.
4.  **Retrieve Structured DM Content:**
    *   If a matching active trigger is found, the controller accesses the `dm_message` attribute of the `PostTrigger` model.
    *   Since `dm_message` is cast to an `array` in the model, it directly provides structured data:
        ```php
        $dmContent = $trigger->dm_message; // e.g., ['media_url' => '...', 'media_type' => 'image', ...]
        $mediaUrl = $dmContent['media_url'] ?? null;
        $mediaType = $dmContent['media_type'] ?? 'image';
        $descriptionText = $dmContent['description_text'] ?? '';
        $ctaText = $dmContent['cta_text'] ?? 'Learn More';
        $ctaUrl = $dmContent['cta_url'] ?? null;
        ```
5.  **Send Direct Message (via `sendConfiguredDm` method):**
    *   The `sendConfiguredDm(string $recipientId, PostTrigger $trigger)` private method is called.
    *   It uses Guzzle HTTP client to make a `POST` request to the Instagram Graph API (`https://graph.facebook.com/vXX.X/me/messages`).
    *   It constructs the message payload using the structured DM content retrieved in the previous step (media, description, CTA).
    *   The `INSTAGRAM_PAGE_ACCESS_TOKEN` environment variable is used for authentication.
6.  **Respond to Instagram:** The controller returns a `200 OK` status code.

## 6. Interaction with Instagram Graph API

The `sendConfiguredDm` method in `InstagramWebhookController` interacts with the Instagram Graph API to send DMs. This involves:

*   **Authentication:** Using the `INSTAGRAM_PAGE_ACCESS_TOKEN`.
*   **API Endpoint:** `POST https://graph.facebook.com/vXX.X/me/messages` (ensure `XX.X` is a current API version).
*   **Parameters:**
    *   `recipient`: `{ "id": "<IGSID_OF_COMMENTER>" }`
    *   `message`: A complex object that can include:
        *   `text`: The main textual part of the message (e.g., `description_text`).
        *   `attachment`: For sending media.
            *   `type`: e.g., 'image', 'video', 'audio'.
            *   `payload`: `{ "url": "<publicly_accessible_media_url>" }`.
        *   `quick_replies` or other button structures for CTAs, if applicable. Often, the CTA is included as a link within the `text`.
          Example for text with embedded CTA:
          `"text": "Check this out: {$descriptionText}\n\n{$ctaText}: {$ctaUrl}"`

## 7. Database Interaction (`post_triggers` table)

*   The webhook controller **reads** from the `post_triggers` table to find matching triggers and retrieve DM content.
*   It uses the `App\Models\PostTrigger` Eloquent model.
*   The `dm_message` column is expected to store a JSON string, which is automatically cast to an array by Eloquent due to the `$casts` property in the model.
*   The Admin Panel is responsible for writing to and managing records in this table.

## 8. Key Dependencies

*   Laravel framework to handle routing, requests, and database interactions.
*   Eloquent ORM for interacting with the PostgreSQL database.
*   An HTTP client library (like Guzzle) to make requests to the Instagram Graph API.

This documentation provides an overview of the webhook's role, how it receives data, its internal processing logic, and its interactions with the database and the Instagram API within the Laravel framework. This information is essential for an AI (or developer) to understand and potentially modify or debug the webhook service.
