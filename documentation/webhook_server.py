import os
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

app = Flask(__name__)

# Replace with your Verify Token
VERIFY_TOKEN = os.environ.get("INSTAGRAM_WEBHOOK_VERIFY_TOKEN", "YOUR_VERIFY_TOKEN")
FACEBOOK_APP_SECRET = os.environ.get("FACEBOOK_APP_SECRET", "YOUR_APP_SECRET")

@app.route('/webhook', methods=['GET'])
def verify_webhook():
    """
    Endpoint to verify the webhook with Facebook.
    """
    mode = request.args.get('hub.mode')
    token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')

    if mode and token:
        if mode == 'subscribe' and token == VERIFY_TOKEN:
            print('WEBHOOK_VERIFIED')
            return challenge, 200
        else:
            return jsonify({'status': 'Verification token mismatch'}), 403
    return jsonify({'status': 'Missing parameters'}), 400

@app.route('/webhook', methods=['POST'])
def handle_webhook():
    """
    Endpoint to handle incoming webhook events from Facebook.
    """
    data = request.get_json()
    # print("Received webhook data:")
    # print(data) # Uncomment for debugging

    # Verify the signature
    signature = request.headers.get('X-Hub-Signature-256')
    if not signature:
        print("Signature header missing!")
        return jsonify({'status': 'Signature header missing'}), 400

    # Split the signature into algorithm and hash
    try:
        sha256_hash = signature.split('=')[1]
    except IndexError:
        print("Invalid signature format!")
        return jsonify({'status': 'Invalid signature format'}), 400

    # Calculate the signature of the payload
    import hmac
    import hashlib
    import json

    # Ensure the payload is in bytes
    payload = request.data
    calculated_signature = hmac.new(FACEBOOK_APP_SECRET.encode('utf-8'), payload, hashlib.sha256).hexdigest()

    # Compare the calculated signature with the received signature
    if not hmac.compare_digest(calculated_signature, sha256_hash):
        print("Signature mismatch!")
        return jsonify({'status': 'Signature mismatch'}), 403

    print("Signature verified successfully.")

    if data.get("object") == "instagram":
        for entry in data.get("entry", []):
            for change in entry.get("changes", []):
                if change.get("field") == "comments":
                    value = change.get("value", {})
                    comment_id = value.get("id")
                    comment_text = value.get("text")
                    media_id = value.get("media", {}).get("id")
                    commenter_id = value.get("from", {}).get("id")
                    # timestamp = value.get("timestamp") # Not used in this basic example

                    print(f"Received comment '{comment_text}' on media {media_id} from user {commenter_id}")

                    # Avoid processing comments from own page/bot ID
                    BOT_INSTAGRAM_USER_ID = os.environ.get("BOT_INSTAGRAM_USER_ID")
                    if BOT_INSTAGRAM_USER_ID and str(commenter_id) == BOT_INSTAGRAM_USER_ID:
                        print("Comment is from the bot's own ID. Skipping.")
                        continue # Skip processing this comment

                    # Filter by TARGET_INSTAGRAM_POST_ID
                    TARGET_INSTAGRAM_POST_ID = os.environ.get("TARGET_INSTAGRAM_POST_ID")
                    if TARGET_INSTAGRAM_POST_ID and str(media_id) != TARGET_INSTAGRAM_POST_ID:
                        print(f"Comment is not on the target post ({TARGET_INSTAGRAM_POST_ID}). Skipping.")
                        continue # Skip processing this comment

                    # Check if comment text contains TRIGGER_KEYWORD (case-insensitive)
                    TRIGGER_KEYWORD = os.environ.get("TRIGGER_KEYWORD", "YOUR_TRIGGER_KEYWORD").lower()

                    if TRIGGER_KEYWORD in comment_text.lower():
                        print(f"Trigger keyword '{TRIGGER_KEYWORD}' found in comment.")

                        # Get necessary environment variables for sending DM
                        PAGE_ACCESS_TOKEN = os.environ.get("INSTAGRAM_PAGE_ACCESS_TOKEN", "YOUR_PAGE_ACCESS_TOKEN")
                        MEDIA_URL = os.environ.get("MEDIA_URL", "YOUR_MEDIA_URL")
                        DESCRIPTION_TEXT = os.environ.get("DESCRIPTION_TEXT", "YOUR_DESCRIPTION_TEXT")
                        TELEGRAM_POST_URL = os.environ.get("TELEGRAM_POST_URL", "YOUR_TELEGRAM_POST_URL")

                        if not PAGE_ACCESS_TOKEN or not MEDIA_URL or not DESCRIPTION_TEXT or not TELEGRAM_POST_URL:
                            print("Error: Missing environment variables for sending DM.")
                            # Consider sending an error notification or logging
                        else:
                            # Construct the message payload
                            message_payload = {
                                "recipient": {"id": commenter_id},
                                "message": {
                                    "attachment": {
                                        "type": "template",
                                        "payload": {
                                            "template_type": "generic",
                                            "elements": [
                                                {
                                                    "title": DESCRIPTION_TEXT,
                                                    "image_url": MEDIA_URL,
                                                    "buttons": [
                                                        {
                                                            "type": "web_url",
                                                            "url": TELEGRAM_POST_URL,
                                                            "title": "View on Telegram" # Or your desired CTA text
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            }

                            # Send the message
                            API_URL = f"https://graph.facebook.com/v19.0/me/messages?access_token={PAGE_ACCESS_TOKEN}" # Use latest version if needed
                            try:
                                response = requests.post(API_URL, json=message_payload)
                                response.raise_for_status() # Raise an exception for bad status codes
                                print("DM sent successfully!")
                                print(response.json())
                            except requests.exceptions.RequestException as e:
                                print(f"Error sending DM: {e}")
                                # Consider logging the error or sending an error notification

                    else:
                        print("Trigger keyword not found.")

    return jsonify({'status': 'Event received'}), 200

if __name__ == '__main__':
    # In a production environment, use a production-ready WSGI server like Gunicorn or uWSGI
    # For local development, you can run with debug=True
    app.run(debug=True, port=5000)
