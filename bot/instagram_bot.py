#!/usr/bin/env python3

import os
import time
import logging
import psycopg2
from dotenv import load_dotenv
from instagrapi import Client
from instagrapi.types import StoryMedia, StorySticker, StoryMention, StoryHashtag, StoryLocation

# Load environment variables
load_dotenv()

# Set up logging
logger = logging.getLogger(__name__)

class InstagramBot:
    def __init__(self):
        """Initialize the Instagram bot."""
        self.instagram_user = os.getenv("INSTAGRAM_USER")
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

        logger.info("InstagramBot initialized")

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
        self.db_cursor.execute("SELECT id, post_id, keyword FROM triggers WHERE is_active = TRUE")
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

    def check_comments(self, post_id, keywords):
        """Check for new comments on a post and match keywords."""
        logger.info(f"Checking comments for post {post_id} with keywords {keywords}")
        post = self.client.post_info(post_id)
        new_comments = []

        for comment in post.comments:
            for keyword in keywords:
                if keyword.lower() in comment.text.lower():
                    new_comments.append(comment)
                    logger.info(f"Matched keyword '{keyword}' in comment: {comment.text}")

        return new_comments

    def send_dm(self, user_id, template):
        """Send a direct message to a user."""
        logger.info(f"Sending DM to user {user_id} with template: {template}")
        self.client.direct_message(user_id, template['content'])

        # Log the activity
        self.log_activity(user_id, template['content'])

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

        # Fetch configuration
        triggers = self.fetch_triggers()
        templates = {t[0]: {'content': t[1], 'media_url': t[2]} for t in templates}

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
                    template_id = next((t[0] for t in templates if keyword.lower() in t[1].lower()), None)

                    if template_id:
                        template = templates[template_id]
                        self.send_dm(user_id, template)

            # Wait before next check
            time.sleep(60)  # Check every minute

    def __del__(self):
        """Clean up resources."""
        if self.db_conn:
            self.db_conn.close()
            logger.info("Closed database connection")