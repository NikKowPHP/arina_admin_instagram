# Instagram Comment Trigger to DM with Media, Description, and CTA Guide

This document outlines the steps required to create a bot that automatically sends a Direct Message (DM) containing media (image, audio, or video), a description, and a Call to Action (CTA) when a user comments on a specific Instagram post with a designated keyword.

## Goal

When a user comments on an Instagram post with a keyword defined in the admin panel, a bot should automatically send that user a Direct Message (DM). The DM content (media, description, CTA) is also managed via the admin panel and stored in the database, allowing for dynamic responses per trigger.

## Prerequisites

1.  **Facebook Developer Account:** You need an account at [https://developers.facebook.com/](https://developers.facebook.com/).
2.  **Facebook App:** Create a new Facebook App within the Developer Dashboard.
3.  **Instagram Business or Creator Account:** The Instagram account that will receive the DMs must be a Business or Creator account.
4.  **Facebook Page:** A Facebook Page linked to the Instagram Business/Creator account.
5.  **Permissions:** Your Facebook App needs the `instagram_manage_comments`, `instagram_manage_messages`, and potentially `pages_messaging` permissions granted through the App Review process.
6.  **Publicly Accessible HTTPS URL:** Your Laravel application needs to be hosted on a server with a stable HTTPS URL to receive webhook notifications.
7.  **Laravel Admin Panel:** A functional Laravel admin panel (as described in `laravel_admin_panel_documentation.md`) for managing `PostTrigger` records, which define the Instagram post ID, keyword, and the structured DM content (media URL, media type, description, CTA text, CTA URL).

## Technical Steps

1.  **Configure Facebook App & Instagram:**
    *   In the Facebook Developer Dashboard for your App, add the "Messenger" product.
    *   In the Messenger settings, configure "Instagram Messaging".
    *   Link your Facebook Page (which is linked to your Instagram account).
    *   Generate a Page Access Token. **Store this securely!** (e.g., in an environment variable `INSTAGRAM_PAGE_ACCESS_TOKEN`).

2.  **Set Up Webhooks:**
    *   In the Messenger -> Instagram Messaging settings, configure Webhooks.
    *   Provide your publicly accessible HTTPS endpoint URL (e.g., `https://your-app-domain.com/api/webhook/instagram`).
    *   Create a **Verify Token**. This is a secret string you define. **Store this securely!** (e.g., in `.env` as `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`). Facebook will use this to verify your endpoint.
    *   Subscribe to the `comments` (for post comments) and/or `messages` (for story replies, if applicable) webhook fields for your linked Facebook Page.

3.  **Laravel Route and Controller (`InstagramWebhookController`):**
    *   A route is defined (e.g., in `routes/api.php`) that points to `App\Http\Controllers\InstagramWebhookController@handle`.
    *   This controller handles webhook verification (`verify` method) and incoming comment/message processing (`handle` method).

4.  **Handle Incoming Comments/Messages (in `InstagramWebhookController@handle`):**
    *   **Verify Signature:** The `handle` method verifies the `X-Hub-Signature-256` header using your `FACEBOOK_APP_SECRET` (from `.env`).
    *   **Parse Payload:** The JSON request body is parsed to extract:
        *   Comment text (e.g., `entry[0].changes[0].value.text`).
        *   The ID of the media the comment was made on (e.g., `entry[0].changes[0].value.media.id` for post comments).
        *   The Instagram Scoped User ID (IGSID) of the commenter (e.g., `entry[0].changes[0].value.from.id`).
    *   **Lookup Triggers in Database:**
        *   The controller queries the `post_triggers` table using the extracted `media.id`.
        *   It iterates through active triggers (`is_active = true`) for that `media.id`.
        *   For each trigger, it checks if the comment `text` contains the trigger's `keyword` (case-insensitive).
    *   **Prepare DM Content from Database:**
        *   If a keyword match is found for a `PostTrigger` record:
            *   The structured DM content is retrieved from the `dm_message` field of the matched `$trigger` (which is stored as JSON and cast to an array in the `PostTrigger` model). This includes:
                *   `media_url`
                *   `media_type` (e.g., 'image', 'video')
                *   `description_text`
                *   `cta_text`
                *   `cta_url` (this will be the Telegram post URL or other link)
    *   **Avoid Loops:** Ensure the comment is not from your own page/bot ID.

5.  **Send DM via Messenger Platform API (Laravel Implementation using `sendConfiguredDm`):**
    *   The `sendConfiguredDm` method in `InstagramWebhookController` is called with the commenter's IGSID and the matched `$trigger` object.
    *   It uses an HTTP client (like Guzzle) to make a `POST` request to the Facebook Graph API: `https://graph.facebook.com/vXX.X/me/messages` (use a specific API version).
    *   The `INSTAGRAM_PAGE_ACCESS_TOKEN` (from `.env`) is included.
    *   The request body is JSON, constructed using the details from the `$trigger->dm_message`.

    **Current Implementation Goal for CTA:** The Call to Action (CTA) in the DM is intended to directly provide the user with the Telegram link (or other configured URL) within the *first* DM. This is typically achieved by embedding the link in the text or using a button that opens the URL directly.

    **Recommendation for Richer DM with Media:** When including media (`media_url` is present), it is highly recommended to use Instagram's "Generic Template" message type. This template allows you to display an image or video alongside a title (from `description_text`) and a `web_url` button (using `cta_text` and `cta_url`). This provides a better user experience than simply embedding the link in the text.

    Example payload using the Generic Template:

    ```json
    {
      "recipient": {"id": "USER_ID"},
      "message": {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "<description_text_from_trigger>",
              "image_url": "<media_url_from_trigger>", // or video_url if type is video
              "buttons": [{
                "type": "web_url",
                "url": "<cta_url_from_trigger>", // Telegram link or other configured URL
                "title": "<cta_text_from_trigger>"
              }]
            }]
          }
        }
      }
    }
    ```

    If no media is provided in the trigger, a simple text message with an embedded link or a text message with a `web_url` button (if supported for text-only messages in this context) can be sent.

    *Note: If the requirement "cta click sends another message with the link" is a strict necessity, this implies a two-step DM process (e.g., using postback buttons and handling `messaging_postbacks`). This would require significant changes to the `dm_message` structure, admin forms, and webhook controller logic. The current documentation and planned implementation focus on a single DM with a direct link CTA.*

    *   **Permissions:** Ensure your app has `instagram_manage_messages`.

6.  **Deployment & Configuration:**
    *   Deploy your Laravel application.
    *   Configure necessary environment variables in your `.env` file:
        *   `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
        *   `INSTAGRAM_PAGE_ACCESS_TOKEN`
        *   `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`
        *   `FACEBOOK_APP_SECRET`
        *   `APP_URL` (used by Laravel, should be your public HTTPS URL)
    *   Ensure the admin panel is secured (e.g., via authentication).

## Next Steps

1.  Ensure your Laravel Admin Panel is set up and you can create/manage `PostTrigger` records with structured DM content (media URL, type, description, CTA text & URL).
2.  Set up your Facebook App, Instagram account, and Facebook Page as per prerequisites.
3.  Obtain `INSTAGRAM_PAGE_ACCESS_TOKEN`, `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`, and `FACEBOOK_APP_SECRET`.
4.  Deploy your Laravel application to a publicly accessible HTTPS server.
5.  Configure the Webhook in the Facebook Developer Dashboard, pointing to your Laravel app's webhook endpoint and subscribing to `comments`.
6.  Use the Admin Panel to create a specific trigger:
    *   Enter the `instagram_post_id` of a test post.
    *   Set a `keyword`.
    *   Fill in the `dm_message` details: `media_url`, `media_type`, `description_text`, `cta_text`, and `cta_url` (e.g., your Telegram link).
    *   Ensure the trigger is `is_active`.
7.  Test thoroughly by commenting on the target Instagram post with the specified keyword.
8.  Check application logs (`storage/logs/laravel.log`) and verify the DM is received correctly with all parts of the structured message.
