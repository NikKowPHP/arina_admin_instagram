# Instagram Comment Trigger to DM with Media, Description, and CTA Guide

This document outlines the steps required to create a bot that automatically sends a Direct Message (DM) containing media (image, audio, or video), a description, and a Call to Action (CTA) when a user comments on a specific Instagram post with a designated keyword.

## Goal

When a user comments on a specific Instagram post with a particular keyword, a bot should automatically send that user a Direct Message (DM) containing predefined media (image, audio, or video), a description, and a Call to Action (CTA) related to a specific post within a Telegram channel.

## Prerequisites

1.  **Facebook Developer Account:** You need an account at [https://developers.facebook.com/](https://developers.facebook.com/).
2.  **Facebook App:** Create a new Facebook App within the Developer Dashboard.
3.  **Instagram Business or Creator Account:** The Instagram account that will receive the DMs must be a Business or Creator account.
4.  **Facebook Page:** A Facebook Page linked to the Instagram Business/Creator account.
5.  **Permissions:** Your Facebook App needs the `instagram_manage_comments`, `instagram_manage_messages`, and potentially `pages_messaging` permissions granted through the App Review process (though you can test with developers/admins before full review).
6.  **Publicly Accessible HTTPS URL:** You need a server or service (like Cloud Run, Heroku, AWS Lambda, etc.) with a stable HTTPS URL to receive webhook notifications from Instagram/Facebook.
7.  **Target Instagram Post ID:** The ID of the specific Instagram post you want to monitor for comments. You can usually find this in the post's URL or via API tools.
8.  **Trigger Keyword:** The specific word or phrase users must include in their comment to trigger the bot.
9.  **Telegram Post Link:** The full URL to the specific Telegram post (e.g., `https://t.me/YourChannelUsername/12345`).
10. **Media URL:** A publicly accessible URL for the image, audio, or video you want to send in the DM.

## Technical Steps

1.  **Configure Facebook App & Instagram:**
    *   In the Facebook Developer Dashboard for your App, add the "Messenger" product.
    *   In the Messenger settings, configure "Instagram Messaging".
    *   Link your Facebook Page (which is linked to your Instagram account).
    *   Generate a Page Access Token. **Store this securely!** (e.g., in an environment variable `INSTAGRAM_PAGE_ACCESS_TOKEN`).

2.  **Set Up Webhooks:**
    *   In the Messenger -> Instagram Messaging settings, configure Webhooks.
    *   Provide your publicly accessible HTTPS endpoint URL (e.g., `https://your-service-url.com/webhook`).
    *   Create a **Verify Token**. This is a secret string you define. **Store this securely!** (e.g., `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`). Facebook will use this to verify your endpoint.
    *   Subscribe to the `comments` webhook field for your linked Facebook Page. **Important:** Ensure you are subscribing to the *Instagram* comments field, not Facebook comments if both are options.

3.  **Set Up Laravel Route and Controller:**
    *   Define a route in your Laravel application (e.g., in `routes/api.php`) to handle incoming POST requests from the Instagram webhook (e.g., `/webhook/instagram`).
    *   Create a dedicated controller (e.g., `InstagramWebhookController`) with a method to handle the incoming request.

4.  **Handle Incoming Comments (Laravel Controller):**
    *   **Verify Signature (Security):** In your controller method, verify the `X-Hub-Signature-256` header using your Facebook App Secret to ensure the request genuinely came from Facebook. Laravel's `Illuminate\Http\Request` object provides access to headers and the request body.
    *   **Parse Payload:** Access the JSON request body using `$request->json()` and parse the `entry[].changes[].value` structure. Extract:
        *   The comment ID (`id`).
        *   The comment text (`text`).
        *   The ID of the post the comment was made on (`media.id`).
        *   The ID of the user who made the comment (`from.id`). This will be the Instagram Scoped User ID (IGSID).
    *   **Filter by Post ID:** Check if the extracted `media.id` matches your `TARGET_INSTAGRAM_POST_ID` (stored in your environment variables). Ignore comments on other posts.
    *   **Check for Keyword:** Check if the comment `text` contains your predefined `TRIGGER_KEYWORD` (case-insensitive check recommended).
    *   **Avoid Loops:** Ensure the comment is not from your own page/bot ID.
    *   **Prepare DM Content:** Retrieve the description text, the `MEDIA_URL` (which can be an image, audio, or video URL), and the `TELEGRAM_POST_URL` (this will be your CTA link) from your environment variables or configuration.

5.  **Send DM via Messenger Platform API (Laravel Implementation):**
    *   Use the commenter's ID (`from.id` from the webhook payload) as the `recipient.id`. Note: This is an IGSID.
    *   Use an HTTP client like Guzzle (install with `composer require guzzlehttp/guzzle`) to make a `POST` request to the Facebook Graph API endpoint: `https://graph.facebook.com/v19.0/me/messages` (use the latest stable API version).
    *   Include your `INSTAGRAM_PAGE_ACCESS_TOKEN` (stored securely in your environment variables) in the request (e.g., as a query parameter `access_token=YOUR_TOKEN`).
    *   The request body should be JSON, specifying the recipient and the message attachment (image, audio, or video) and text (description and CTA leading to the Telegram post).
        ```json
        {
          "recipient": {
            "id": "<IGSID_FROM_WEBHOOK>"
          },
          "message": {
            "attachment": {
              "type": "<media_type>",  // 'image', 'audio', or 'video'
              "payload": {
                "url": "YOUR_PUBLIC_MEDIA_URL_HERE",
                "is_reusable": true // Optional: set to true if sending the same media often
              }
            },
            "text": "YOUR_DESCRIPTION_TEXT_HERE\n\nYOUR_CTA_TEXT_HERE: YOUR_TELEGRAM_POST_URL_HERE"
          }
        }
        ```
    *   **Important:** Sending a message to an IGSID initiates a standard messaging conversation via the Messenger Platform. Ensure your app has the necessary permissions (`instagram_manage_messages`, `pages_messaging`). The Messenger Platform API supports sending various media types.

6.  **Deployment:**
    *   Deploy your Laravel application to a platform that provides a public HTTPS URL (e.g., a web server with PHP support).
    *   Configure necessary environment variables (`INSTAGRAM_PAGE_ACCESS_TOKEN`, `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`, `FACEBOOK_APP_SECRET`, `TARGET_INSTAGRAM_POST_ID`, `TRIGGER_KEYWORD`, `MEDIA_URL`, `DESCRIPTION_TEXT`, `CTA_TEXT`, `TELEGRAM_POST_URL`).

## Next Steps

1.  Follow the prerequisites to set up your Facebook App and Instagram connection.
2.  Obtain the necessary tokens, IDs, keyword, and URLs (Telegram post, image).
3.  Implement the Laravel route and controller to handle webhook requests and process comment data.
4.  Implement the logic to send DMs using an HTTP client like Guzzle.
5.  Deploy the application and configure the webhook (subscribing to `comments`) in the Facebook Developer Dashboard.
6.  Test thoroughly by commenting on the target post with the keyword. Check application logs and verify the DM is received correctly.
