# Instagram Bot Webhook Documentation

This document provides documentation for the Laravel implementation of the Instagram webhook handler and bot logic. Its primary function is to receive real-time comment notifications from Instagram via webhooks and trigger automated direct messages (DMs) based on predefined triggers stored in a PostgreSQL database.

## 1. Purpose

The webhook service acts as the bridge between the Instagram platform and the bot's DM sending capability. It listens for specific events (like comments on a post) and initiates the automated response process.

## 2. Webhook Endpoint

*   **URL:** This is the public URL where Instagram will send POST requests containing comment data. The exact URL will depend on your deployment environment.
*   **Method:** `POST`

## 3. Instagram Webhook Payload (Comments)

When a user comments on an Instagram post that your bot is subscribed to, Instagram sends a POST request to your configured webhook URL. The request body will contain a JSON payload with details about the event. The structure is part of the Instagram Graph API webhook documentation, but key relevant fields for a comment might include:

*   `object`: Type of object (e.g., "instagram").
*   `entry`: An array of entries.
    *   `id`: Page ID.
    *   `time`: Timestamp of the update.
    *   `changes`: An array of changes.
        *   `field`: The type of change (e.g., "comments").
        *   `value`: An object containing details about the comment.
            *   `id`: The comment ID.
            *   `from`: An object with the user's ID and username who made the comment.
            *   `media`: An object with the media (post) ID and owner ID.
            *   `text`: The content of the comment.
            *   `timestamp`: Timestamp of the comment.
            *   `parent_id`: (If it's a reply to another comment).

The webhook needs to parse this JSON payload to extract the `media` (post) ID, the `text` of the comment, and the `from` user's ID.

## 4. Expected Webhook Response

Upon successful receipt and processing of the webhook payload, the webhook endpoint should return:

*   **HTTP Status Code:** `200 OK`

This signals to Instagram that the notification was received successfully.

## 5. Internal Logic Flow (Laravel Implementation)

When the Laravel application receives a POST request from the Instagram webhook:

1.  **Receive and Parse Payload:** A dedicated route and controller method receive the JSON payload and parse it to extract relevant information, particularly the Instagram `post_id`, the `comment_text`, and the commenting `user_id`.
2.  **Verify Signature:** The controller verifies the request signature (`X-Hub-Signature-256`) using the Facebook App Secret to ensure the request is legitimate.
3.  **Database Lookup:** The application uses the Eloquent model (`App\Models\PostTrigger`) to query the `post_triggers` table. It searches for an active trigger where the `instagram_post_id` matches the post ID from the webhook and the `comment_text` contains the `keyword` defined in the trigger.
4.  **Retrieve DM Message:** If a matching active trigger is found, the application retrieves the associated `dm_message` from the database using the Eloquent model.
5.  **Send Direct Message:** Using a suitable HTTP client (like Guzzle) and the Instagram Graph API, the application sends the retrieved `dm_message` as a direct message to the `user_id` who made the comment. This requires authentication with the Instagram API using an access token and making a POST request to the appropriate API endpoint.
6.  **Respond to Instagram:** The controller returns a `200 OK` status code to the Instagram webhook endpoint.

## 6. Interaction with Instagram Graph API

The webhook service interacts with the Instagram Graph API primarily to send direct messages. This involves:

*   **Authentication:** Using an access token with the necessary permissions to send messages.
*   **API Endpoint:** Making a POST request to the appropriate API endpoint for sending messages (refer to the official Instagram Graph API documentation for the exact endpoint and required parameters).
*   **Parameters:** Including the recipient user ID and the message content in the API request.

## 7. Database Interaction

The webhook service reads from the `post_triggers` table in the shared PostgreSQL database. It does **not** write to or modify this table; that is the responsibility of the Admin Panel.

## 8. Key Dependencies

*   Laravel framework to handle routing, requests, and database interactions.
*   Eloquent ORM for interacting with the PostgreSQL database.
*   An HTTP client library (like Guzzle) to make requests to the Instagram Graph API.

This documentation provides an overview of the webhook's role, how it receives data, its internal processing logic, and its interactions with the database and the Instagram API within the Laravel framework. This information is essential for an AI (or developer) to understand and potentially modify or debug the webhook service.
