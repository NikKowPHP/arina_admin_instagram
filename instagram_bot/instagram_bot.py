#!/usr/bin/env python3

import os
import time
import logging
import psycopg2
import functools
import tempfile
import re
import requests
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
        self.instagram_user = os.getenv("INSTAGRAM_USERNAME")
        self.instagram_password = os.getenv("INSTAGRAM_PASSWORD")
        self.db_host = os.getenv("DB_HOST", "localhost")
        self.db_port = os.getenv("DB_PORT", "5432")
        self.db_name = os.getenv("DB_NAME", "postgres")
        self.db_user = os.getenv("DB_USER", "postgres")
        self.db_password = os.getenv("DB_PASSWORD", "password")

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
        self.db_conn = psycopg2.connect(
            host=self.db_host,
            port=self.db_port,
            dbname=self.db_name,
            user=self.db_user,
            password=self.db_password
        )
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
        self.db_cursor.execute("SELECT id, content, media_url FROM dm_templates")
        templates = self.db_cursor.fetchall()
        logger.info(f"Fetched {len(templates)} DM templates")
        return templates

    # ROO-AUDIT-TAG :: plan-001-comment-monitoring.md :: Comment stream listener setup
    def check_comments(self, post_id, keywords):
        """Check for new comments on a post and match keywords, with duplicate detection."""
        logger.info(f"Checking comments for post {post_id} with keywords {keywords}")
        try:
            post = self.client.post_info(post_id)
            new_comments = []

            # Get already processed comment IDs for this post
            self.db_cursor.execute(
                "SELECT comment_id FROM processed_comments WHERE post_id = %s",
                (post_id,)
            )
            processed_comment_ids = {row[0] for row in self.db_cursor.fetchall()}

            for comment in post.comments:
                comment_id = comment.id

                # Skip if comment is already processed
                if comment_id in processed_comment_ids:
                    logger.info(f"Skipping already processed comment {comment_id}")
                    continue

                # Check each keyword against the comment text
                for keyword in keywords:
                    try:
                        # Use regex for exact word matching (case-insensitive)
                        regex = re.compile(rf'\b{re.escape(keyword)}\b', re.IGNORECASE)
                        if regex.search(comment.text):
                            new_comments.append(comment)
                            logger.info(f"Exact match found for keyword '{keyword}' in comment: {comment.text}")
                            
                            # Log additional match details to database
                            self.db_cursor.execute(
                                """INSERT INTO comment_matches
                                   (comment_id, post_id, keyword, matched_text, full_comment)
                                   VALUES (%s, %s, %s, %s, %s)""",
                                (comment_id, post_id, keyword,
                                 comment.text[:100],  # Store first 100 chars of matched text
                                 comment.text)
                            )
                            self.db_conn.commit()
                            break  # No need to check other keywords once a match is found
                            
                    except Exception as e:
                        logger.error(f"Error processing keyword '{keyword}': {str(e)}")
                        # Log the error to database
                        self.db_cursor.execute(
                            "INSERT INTO processing_errors (post_id, keyword, error_message) VALUES (%s, %s, %s)",
                            (post_id, keyword, str(e))
                        )
                        self.db_conn.commit()

            return new_comments
        except Exception as e:
            logger.error(f"Error checking comments for post {post_id}: {str(e)}")
            return []
    # ROO-AUDIT-TAG :: plan-001-comment-monitoring.md :: END

    @_rate_limited
    def send_dm(self, user_id, template):
        """Send a direct message to a user with optional media attachment (rate limited)."""
        logger.info(f"Sending DM to user {user_id} with template: {template}")

        # Prepare message content
        message = template['content']

        # Check for media URL in template
        media_url = template.get('media_url')
        media_sent = False

        try:
            if media_url:
                logger.info(f"Media URL found in template: {media_url}")

                try:
                    # Download media directly using instagrapi
                    logger.info(f"Downloading media from {media_url}")
                    response = requests.get(media_url, stream=True)
                    response.raise_for_status()

                    # Upload media to Instagram using instagrapi
                    logger.info(f"Uploading media to Instagram")
                    media = self.client.photo_upload_from_url(media_url)

                    # Send media with message
                    logger.info(f"Sending media DM to user {user_id}")
                    self.client.direct_message(user_id, message, media=media)
                    media_sent = True
                    logger.info(f"Successfully sent media to user {user_id}")
                except Exception as media_e:
                    logger.error(f"Failed to send media: {str(media_e)}")
                    # Fall back to text-only message
                    self.client.direct_message(user_id, message)
                    logger.info(f"Fallback: Sent text-only message to user {user_id}")
            else:
                # Send text-only message
                self.client.direct_message(user_id, message)
                logger.info(f"Successfully sent text message to user {user_id}")

            # Log the activity
            action_type = "sent_dm_with_media" if media_sent else "sent_dm"
            self.log_activity(user_id, message)

        except Exception as e:
            error_msg = f"Failed to send DM to user {user_id}: {str(e)}"
            logger.error(error_msg)

            # Store in dead-letter queue
            self.db_cursor.execute(
                "INSERT INTO dead_letter_queue (user_id, action, details, error_message) VALUES (%s, %s, %s, %s)",
                (user_id, "send_dm", message, error_msg)
            )
            self.db_conn.commit()
            logger.warning(f"Added failed DM to dead-letter queue for user {user_id}")

            # Alert admin
            admin_user_id = os.getenv("ADMIN_USER_ID")
            if admin_user_id:
                alert_message = f"⚠️ Bot Error: {error_msg}"
                try:
                    self.client.direct_message(admin_user_id, alert_message)
                    logger.warning(f"Sent admin alert to {admin_user_id}")
                except Exception as alert_e:
                    logger.error(f"Failed to send admin alert: {str(alert_e)}")

            raise Exception(error_msg)

    def log_activity(self, user_id, message):
        """Log bot activity to the database."""
        logger.info(f"Logging activity for user {user_id}")
        self.db_cursor.execute(
            "INSERT INTO activity_log (user_id, action, details) VALUES (%s, %s, %s)",
            (user_id, "sent_dm", message)
        )
        self.db_conn.commit()

    def run(self):
        """Main bot loop."""
        # Connect to services
        self.connect_to_instagram()
        self.connect_to_database()

        # Create processed_comments table if it doesn't exist
        self.db_cursor.execute("""
            CREATE TABLE IF NOT EXISTS processed_comments (
                comment_id TEXT PRIMARY KEY,
                post_id TEXT NOT NULL,
                processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)
        self.db_conn.commit()
        logger.info("Ensured processed_comments table exists")

        # Create dead_letter_queue table if it doesn't exist
        self.db_cursor.execute("""
            CREATE TABLE IF NOT EXISTS dead_letter_queue (
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                action TEXT NOT NULL,
                details TEXT NOT NULL,
                error_message TEXT NOT NULL,
                timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)
        self.db_conn.commit()
        logger.info("Ensured dead_letter_queue table exists")

        # Fetch configuration
        triggers = self.fetch_triggers()
        # Build templates dictionary with ID as key
        templates = self.fetch_templates()
        templates_dict = {
            str(t[0]): {  # Ensure key is string to match database UUID string format
                'content': t[1],
                'media_url': t[2]
            } for t in templates
        }
        logger.info(f"Loaded {len(templates_dict)} templates into memory")

        # Main loop
        while True:
            for trigger in triggers:
                post_id = trigger[1]
                keyword = trigger[2]

                # Check for new comments
                matched_comments = self.check_comments(post_id, [keyword])

                # Send DMs for matched comments
                for comment in matched_comments:
                    user_id = comment.user.id
                    template_id = trigger[3]  # template_id is the 4th element
                    comment_id = comment.id

                    if not template_id:
                        logger.error(f"Trigger {trigger[0]} has no template_id assigned")
                        continue

                    template = templates_dict.get(str(template_id))
                    if template:
                        try:
                            self.send_dm(user_id, template)

                            # Store processed comment ID
                            self.db_cursor.execute(
                                "INSERT INTO processed_comments (comment_id, post_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                                (comment_id, post_id)
                            )
                            self.db_conn.commit()
                            logger.info(f"Stored processed comment {comment_id} for post {post_id}")
                        except Exception as e:
                            logger.error(f"Failed to process comment {comment_id}: {str(e)}")
                            # Store failed comment in dead-letter queue
                            self.db_cursor.execute(
                                "INSERT INTO dead_letter_queue (user_id, action, details, error_message) VALUES (%s, %s, %s, %s)",
                                (user_id, "process_comment", f"Trigger: {trigger[0]}", str(e))
                            )
                            self.db_conn.commit()
                        else:
                            logger.error(f"No template found with ID {template_id} for trigger {trigger[0]}")
                            # Store missing template error in dead-letter queue
                            self.db_cursor.execute(
                                "INSERT INTO dead_letter_queue (user_id, action, details, error_message) VALUES (%s, %s, %s, %s)",
                                (user_id, "missing_template", f"Trigger: {trigger[0]}", f"No template {template_id}")
                            )
                            self.db_conn.commit()

            # Wait before next check
            time.sleep(60)  # Check every minute

    def __del__(self):
        """Clean up resources."""
        if self.db_conn:
            self.db_conn.close()
            logger.info("Closed database connection")