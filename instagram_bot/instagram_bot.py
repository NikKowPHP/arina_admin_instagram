# file: instagram_bot/instagram_bot.py
#!/usr/bin/env python3

import os
import time
import logging
import psycopg2
import functools
import tempfile
import re
import requests
import json
from datetime import datetime, timedelta
from urllib.request import urlopen, Request, URLError, HTTPError
from dotenv import load_dotenv
from instagrapi import Client
from instagrapi.types import StoryMedia, StorySticker, StoryMention, StoryHashtag, StoryLocation

# Load environment variables
load_dotenv()

# Set up logging
logger = logging.getLogger(__name__)

# Rate limiting configuration
DM_RATE_LIMIT = int(os.getenv("DM_RATE_LIMIT", 10))  # Default: 10 messages per hour per user
RATE_LIMIT_WINDOW = timedelta(hours=1)  # 1 hour window

class InstagramBot:
    def __init__(self):
        """Initialize the Instagram bot."""
        self.instagram_user = os.getenv("INSTAGRAM_USERNAME") # Corrected from INSTAGRAM_USERNAME
        self.instagram_password = os.getenv("INSTAGRAM_PASSWORD")
        self.database_url = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/postgres")

        # Initialize Instagram client
        self.client = None

        # Initialize database connection
        self.db_conn = None
        self.db_cursor = None

        # Rate limiting tracking
        self.dm_send_timestamps = {}  # user_id -> list of timestamps

        logger.info("InstagramBot initialized")

    @staticmethod
    def _rate_limited(func):
        """Decorator to enforce rate limiting for DM sends."""
        @functools.wraps(func)
        def wrapper(self, user_id, *args, **kwargs):
            current_time = datetime.now()

            # Initialize user entry if not exists
            if user_id not in self.dm_send_timestamps:
                self.dm_send_timestamps[user_id] = []

            # Remove timestamps outside the rate limit window
            self.dm_send_timestamps[user_id] = [
                ts for ts in self.dm_send_timestamps[user_id]
                if current_time - ts < RATE_LIMIT_WINDOW
            ]

            # Check if rate limit exceeded
            if len(self.dm_send_timestamps[user_id]) >= DM_RATE_LIMIT:
                time_until_reset = (RATE_LIMIT_WINDOW -
                                    (current_time - self.dm_send_timestamps[user_id][0]))
                minutes_until_reset = int(time_until_reset.total_seconds() // 60)
                error_msg = (
                    f"Rate limit exceeded for user {user_id}. "
                    f"Try again in {minutes_until_reset} minutes."
                )
                logger.warning(error_msg)
                raise Exception(error_msg)

            # Record the current timestamp
            self.dm_send_timestamps[user_id].append(current_time)

            return func(self, user_id, *args, **kwargs)
        return wrapper

    def connect_to_instagram(self):
        """Connect to Instagram API."""
        logger.info("Connecting to Instagram...")
        self.client = Client()
        self.client.login(self.instagram_user, self.instagram_password)
        logger.info("Successfully connected to Instagram")

    def connect_to_database(self):
        """Connect to the PostgreSQL database."""
        logger.info("Connecting to database...")
        self.db_conn = psycopg2.connect(self.database_url)
        self.db_cursor = self.db_conn.cursor()
        logger.info("Successfully connected to database")

    def fetch_triggers(self):
        """Fetch active triggers from the database."""
        logger.info("Fetching active triggers from database...")
        self.db_cursor.execute("SELECT id, post_id, keyword, template_id FROM triggers WHERE is_active = TRUE")
        triggers = self.db_cursor.fetchall()
        logger.info(f"Fetched {len(triggers)} active triggers")
        return triggers

    def fetch_templates(self):
        """Fetch DM templates from the database."""
        logger.info("Fetching DM templates from database...")
        self.db_cursor.execute("SELECT id, content, media_url FROM templates")
        templates = self.db_cursor.fetchall()
        logger.info(f"Fetched {len(templates)} DM templates")
        return templates

    def check_comments(self, post_id, keywords):
        """Check for new comments on a post and match keywords, with duplicate detection."""
        logger.info(f"Checking comments for post {post_id} with keywords {keywords}")
        try:
            post_comments = self.client.media_comments(self.client.media_pk_from_url(f"https://www.instagram.com/p/{post_id}/"))
            new_comments = []

            self.db_cursor.execute(
                "SELECT comment_id FROM processed_comments WHERE post_id = %s",
                (post_id,)
            )
            processed_comment_ids = {row[0] for row in self.db_cursor.fetchall()}

            for comment in post_comments:
                comment_id = str(comment.pk)

                if comment_id in processed_comment_ids:
                    continue

                for keyword in keywords:
                    if re.search(rf'\b{re.escape(keyword)}\b', comment.text, re.IGNORECASE):
                        new_comments.append(comment)
                        logger.info(f"Match found for keyword '{keyword}' in comment: {comment.text}")
                        try:
                            self.db_cursor.execute(
                                """INSERT INTO comment_matches
                                   (id, comment_id, post_id, keyword, matched_text, full_comment)
                                   VALUES (gen_random_uuid(), %s, %s, %s, %s, %s)""",
                                (comment_id, post_id, keyword, comment.text[:100], comment.text)
                            )
                            self.db_conn.commit()
                        except Exception as db_e:
                            self.db_conn.rollback()
                            logger.error(f"Failed to log comment match for {comment_id}: {str(db_e)}")
                        break
            return new_comments
        except Exception as e:
            logger.error(f"Error checking comments for post {post_id}: {str(e)}")
            # *** FIX: Rollback transaction on any failure to prevent connection state issues ***
            self.db_conn.rollback()
            return []

    @_rate_limited
    def send_dm(self, user_id, template):
        """Send a direct message to a user with optional media attachment (rate limited)."""
        message = template['content']
        media_url = template.get('media_url')
        logger.info(f"Attempting to send DM to user {user_id}")

        if media_url:
            logger.info(f"Media URL found: {media_url}")
            try:
                # Instagrapi doesn't support sending from URL directly. We need to download it first.
                req = Request(media_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urlopen(req) as response:
                    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
                        tmp_file.write(response.read())
                        media_path = tmp_file.name
                
                file_ext = os.path.splitext(media_url)[1].lower()
                if file_ext in ('.mp4', '.mov'):
                    self.client.direct_send_video(media_path, user_ids=[user_id])
                    self.client.direct_send(message, user_ids=[user_id])
                else:
                    self.client.direct_send_photo(media_path, user_ids=[user_id])
                    self.client.direct_send(message, user_ids=[user_id])
                
                os.remove(media_path) # Clean up the temporary file
                logger.info(f"Successfully sent media DM to user {user_id}")
            except Exception as media_e:
                logger.error(f"Failed to send media: {media_e}. Falling back to text-only.")
                self.client.direct_send(message, user_ids=[user_id])
        else:
            self.client.direct_send(message, user_ids=[user_id])
            logger.info(f"Successfully sent text-only DM to user {user_id}")

        self.log_activity(str(user_id), message)

    def log_activity(self, user_id, message):
        """Log bot activity to the database."""
        try:
            self.db_cursor.execute(
                "INSERT INTO activity_log (id, user_id, action, details) VALUES (gen_random_uuid(), %s, %s, %s)",
                (user_id, "sent_dm", json.dumps({"message": message}))
            )
            # Do not commit here, let the main loop handle it.
        except Exception as e:
            logger.error(f"Failed to stage activity log for user {user_id}: {str(e)}")
            raise  # Re-raise to trigger rollback in the main loop

    def _log_dead_letter_queue(self, user_id, action, details, error_message):
        """Helper to log failed actions to the dead-letter queue."""
        try:
            # This function should be self-contained and not interfere with the main transaction
            conn = psycopg2.connect(self.database_url)
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO dead_letter_queue (id, user_id, action, details, error_message) VALUES (gen_random_uuid(), %s, %s, %s, %s)",
                (str(user_id), action, str(details), str(error_message))
            )
            conn.commit()
            cursor.close()
            conn.close()
        except Exception as e:
            logger.error(f"CRITICAL: Failed to log to dead-letter queue for user {user_id}: {str(e)}")

    def _update_health_status(self):
        """Update the bot's health status in the database."""
        try:
            current_time = datetime.now()
            status_details = json.dumps({"last_check": current_time.isoformat()})
            
            self.db_cursor.execute("""
                INSERT INTO bot_status (id, service_name, is_healthy, last_ping, details)
                VALUES (gen_random_uuid(), 'instagram_bot', TRUE, %s, %s)
                ON CONFLICT (service_name)
                DO UPDATE SET
                    is_healthy = EXCLUDED.is_healthy,
                    last_ping = EXCLUDED.last_ping,
                    details = EXCLUDED.details
            """, (current_time, status_details))
            self.db_conn.commit()
            logger.debug("Updated health status in database")
        except Exception as e:
            self.db_conn.rollback()
            logger.error(f"Failed to update health status: {str(e)}")

    def run_single_check(self):
        """Execute a single cycle of the bot's checks."""
        try:
            self.connect_to_instagram()
            self.connect_to_database()
            triggers = self.fetch_triggers()
            templates_list = self.fetch_templates()
            templates_dict = {str(t[0]): {'content': t[1], 'media_url': t[2]} for t in templates_list}

            for trigger_id, post_id, keyword, template_id in triggers:
                if not post_id: continue

                matched_comments = self.check_comments(post_id, [keyword])

                for comment in matched_comments:
                    user_id = str(comment.user.pk)
                    comment_id = str(comment.pk)
                    
                    # *** FIX: Improved transaction handling per comment ***
                    try:
                        if not template_id:
                            logger.error(f"Trigger {trigger_id} has no template_id assigned")
                            raise ValueError("Missing template_id")
                        
                        template = templates_dict.get(str(template_id))
                        if not template:
                            logger.error(f"No template found with ID {template_id} for trigger {trigger_id}")
                            raise ValueError(f"Template not found: {template_id}")

                        self.send_dm(user_id, template)

                        self.db_cursor.execute(
                            "INSERT INTO processed_comments (id, comment_id, post_id) VALUES (gen_random_uuid(), %s, %s) ON CONFLICT (comment_id) DO NOTHING",
                            (comment_id, post_id)
                        )
                        self.db_conn.commit()
                        logger.info(f"Successfully processed and committed comment {comment_id}")

                    except Exception as e:
                        self.db_conn.rollback()
                        logger.error(f"Failed to process comment {comment_id} for user {user_id}: {e}")
                        self._log_dead_letter_queue(user_id, "process_comment", {"trigger": trigger_id, "comment": comment.text}, str(e))

            self._update_health_status()
        except psycopg2.InterfaceError:
            logger.error("Database connection lost. Reconnecting...")
            self.connect_to_database()
        except Exception as loop_e:
            logger.critical(f"An unexpected error occurred in the main loop: {loop_e}")
        finally:
            if self.db_conn:
                self.db_conn.close()
                logger.info("Closed database connection for single run.")

    def run_continuously(self):
        """Run the bot in continuous polling mode (for local development)."""
        self.connect_to_instagram()
        self.connect_to_database()

        while True:
            self.run_single_check()
            time.sleep(60)

    def __del__(self):
        """Clean up resources."""
        if self.db_conn:
            self.db_conn.close()
            logger.info("Closed database connection")

def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    bot = InstagramBot()
    bot.run_continuously()

if __name__ == "__main__":
    main()