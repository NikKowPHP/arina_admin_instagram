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

3.  **Create a Web Server Backend:**
    *   Choose a web framework (e.g., Flask, FastAPI, Express).
    *   Create two endpoints:
        *   `GET /webhook`: Handles the webhook verification request from Facebook. It must check if the `hub.verify_token` query parameter matches your `INSTAGRAM_WEBHOOK_VERIFY_TOKEN` and respond with the `hub.challenge` value.
        *   `POST /webhook`: Receives the actual message notifications from Instagram.

4.  **Handle Incoming Comments (`POST /webhook`):**
    *   **Verify Signature (Security):** Verify the `X-Hub-Signature-256` header using your App Secret to ensure the request genuinely came from Facebook.
    *   **Parse Payload:** The request body will contain JSON data about the incoming comment(s). You need to parse the `entry[].changes[].value` structure. Extract:
        *   The comment ID (`id`).
        *   The comment text (`text`).
        *   The ID of the post the comment was made on (`media.id`).
        *   The ID of the user who made the comment (`from.id`). This will be the Instagram Scoped User ID (IGSID).
    *   **Filter by Post ID:** Check if the `media.id` matches your `TARGET_INSTAGRAM_POST_ID`. Ignore comments on other posts.
    *   **Check for Keyword:** Check if the comment `text` contains your predefined `TRIGGER_KEYWORD` (case-insensitive check recommended).
    *   **Avoid Loops:** Ensure the comment is not from your own page/bot ID.
    *   **Prepare DM Content:** Define the description text, the `MEDIA_URL` (which can be an image, audio, or video URL), and the `TELEGRAM_POST_URL` (this will be your CTA link). Store these preferably in environment variables.

5.  **Send DM via Messenger Platform API:**
    *   Use the commenter's ID (`from.id` from the webhook payload) as the `recipient.id`. Note: This is an IGSID.
    *   Make a `POST` request to the Facebook Graph API endpoint: `https://graph.facebook.com/v19.0/me/messages` (use the latest stable API version).
    *   Include your `INSTAGRAM_PAGE_ACCESS_TOKEN` in the request (e.g., as a query parameter `access_token=YOUR_TOKEN`).
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
    *   Deploy your web server application to a platform that provides a public HTTPS URL (Cloud Run, Heroku, etc.).
    *   Configure necessary environment variables (`INSTAGRAM_PAGE_ACCESS_TOKEN`, `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`, `FACEBOOK_APP_SECRET`, `TARGET_INSTAGRAM_POST_ID`, `TRIGGER_KEYWORD`, `MEDIA_URL`, `DESCRIPTION_TEXT`, `CTA_TEXT`, `TELEGRAM_POST_URL`).

## Example (Conceptual Python/Flask)

```python
import os
import hmac
import hashlib
import json
import requests # Use requests library
from flask import Flask, request, abort, Response

app = Flask(__name__)

# Load from environment variables
FB_APP_SECRET = os.environ.get("FACEBOOK_APP_SECRET")
VERIFY_TOKEN = os.environ.get("INSTAGRAM_WEBHOOK_VERIFY_TOKEN")
PAGE_ACCESS_TOKEN = os.environ.get("INSTAGRAM_PAGE_ACCESS_TOKEN")
TARGET_POST_ID = os.environ.get("TARGET_INSTAGRAM_POST_ID")
TRIGGER_KEYWORD = os.environ.get("TRIGGER_KEYWORD", "DEFAULT_KEYWORD").lower() # Store keyword lowercase
MEDIA_URL = os.environ.get("MEDIA_URL")
DESCRIPTION_TEXT = os.environ.get("DESCRIPTION_TEXT", "Here is the information you requested!")
CTA_TEXT = os.environ.get("CTA_TEXT", "Find more details here") # Text for the CTA
TELEGRAM_POST_URL = os.environ.get("TELEGRAM_POST_URL") # Link for the CTA

@app.route('/webhook', methods=['GET'])
def webhook_verify():
    """ Handle webhook verification """
    if request.args.get('hub.mode') == 'subscribe' and request.args.get('hub.verify_token') == VERIFY_TOKEN:
        print("Webhook verified!")
        return request.args.get('hub.challenge'), 200
    else:
        print("Webhook verification failed.")
        return 'Forbidden', 403

@app.route('/webhook', methods=['POST'])
def webhook_handler():
    """ Handle incoming webhook events (comments) """
    # Verify request signature
    signature = request.headers.get('X-Hub-Signature-256')
    if not signature:
        print("Missing signature.")
        abort(400)

    hash_object = hmac.new(FB_APP_SECRET.encode('utf-8'), msg=request.data, digestmod=hashlib.sha256)
    expected_signature = 'sha256=' + hash_object.hexdigest()

    if not hmac.compare_digest(expected_signature, signature):
        print("Invalid signature.")
        abort(400)

    # Process incoming comment event
    data = request.get_json()
    print("Received webhook data:", json.dumps(data, indent=2)) # Log for debugging

    if data.get("object") == "instagram":
        for entry in data.get("entry", []):
            for change in entry.get("changes", []):
                if change.get("field") == "comments":
                    comment_data = change.get("value", {})
                    media_id = comment_data.get("media", {}).get("id")
                    comment_text = comment_data.get("text", "").lower() # Process text lowercase
                    commenter_id = comment_data.get("from", {}).get("id") # This is the IGSID
                    comment_id = comment_data.get("id")

                    print(f"Received comment ID {comment_id} on media {media_id} from {commenter_id}")

                    # Check if it's the target post and contains the keyword
                    if media_id == TARGET_POST_ID and TRIGGER_KEYWORD in comment_text:
                        print(f"Keyword '{TRIGGER_KEYWORD}' found in comment on target post.")
                        send_dm_reply(commenter_id, DESCRIPTION_TEXT, CTA_TEXT, TELEGRAM_POST_URL, MEDIA_URL)
                    else:
                        print("Comment not on target post or keyword not found.")

    return "EVENT_RECEIVED", 200

def send_dm_reply(recipient_igsid, description_text, cta_text, telegram_post_url, media_url):
    """ Sends DM back to user via Messenger Platform API """
    params = {"access_token": PAGE_ACCESS_TOKEN}
    headers = {"Content-Type": "application/json"}

    message_payload = {
        "recipient": {"id": recipient_igsid},
        "message": {}
    }

    # Add media attachment if MEDIA_URL is provided
    if media_url:
        media_type = "image" # Default to image, could add logic to determine type
        # Basic check for file extension to determine media type
        if media_url.lower().endswith(('.mp4', '.mov')):
            media_type = 'video'
        elif media_url.lower().endswith(('.mp3', '.wav')):
            media_type = 'audio'

        message_payload["message"]["attachment"] = {
            "type": media_type,
            "payload": {
                "url": media_url,
                "is_reusable": True
            }
        }

    # Add text (description and CTA)
    text_message = description_text
    if cta_text and telegram_post_url:
        text_message += f"\n\n{cta_text}: {telegram_post_url}"

    message_payload["message"]["text"] = text_message

    graph_api_url = "https://graph.facebook.com/v19.0/me/messages" # Use appropriate version

    try:
        response = requests.post(graph_api_url, params=params, headers=headers, data=json.dumps(message_payload))
        response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
        print(f"Successfully sent DM reply to {recipient_igsid}: {response.json()}")
    except requests.exceptions.RequestException as e:
        print(f"Error sending DM reply to {recipient_igsid}: {e}")
        if e.response is not None:
            print(f"Response status code: {e.response.status_code}")
            print(f"Response body: {e.response.text}")


if __name__ == '__main__':
    # Make sure to set environment variables before running
    required_vars = [
        "FACEBOOK_APP_SECRET", "INSTAGRAM_WEBHOOK_VERIFY_TOKEN",
        "INSTAGRAM_PAGE_ACCESS_TOKEN", "TARGET_INSTAGRAM_POST_ID",
        "TRIGGER_KEYWORD", "DESCRIPTION_TEXT", "CTA_TEXT", "TELEGRAM_POST_URL"
    ]
    # MEDIA_URL is optional, but if not provided, text content must be.
    if not all(os.environ.get(var) for var in required_vars):
         print(f"ERROR: Missing one or more required environment variables: {', '.join(var for var in required_vars if not os.environ.get(var))}")
    elif not os.environ.get("MEDIA_URL") and not (os.environ.get("DESCRIPTION_TEXT") or (os.environ.get("CTA_TEXT") and os.environ.get("TELEGRAM_POST_URL"))):
         print("ERROR: At least MEDIA_URL or text content (DESCRIPTION_TEXT and CTA with TELEGRAM_POST_URL) must be provided.")
    else:
        # Port should be configured based on deployment environment (e.g., PORT env var for Cloud Run)
        port = int(os.environ.get("PORT", 8080))
        print(f"Starting Flask server on port {port}")
        # Use waitress or gunicorn in production instead of Flask's development server
        app.run(host='0.0.0.0', port=port, debug=False) # Turn off debug in production
```

## Next Steps

1.  Follow the prerequisites to set up your Facebook App and Instagram connection.
2.  Obtain the necessary tokens, IDs, keyword, and URLs (Telegram post, image).
3.  Develop the web server application based on the steps above, ensuring correct parsing of comment webhooks and construction of the DM payload.
4.  Deploy the application and configure the webhook (subscribing to `comments`) in the Facebook Developer Dashboard.
5.  Test thoroughly by commenting on the target post with the keyword. Check server logs and verify the DM is received correctly.
