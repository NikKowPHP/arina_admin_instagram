#!/usr/bin/env python3
# ROO-AUDIT-TAG :: plan-011-bot-fixes.md :: Implement bot fixes
"""
Instagram Bot Service Implementation
"""

import os
import logging
import requests
import sys
from supabase import create_client, Client
from instagram_private_api import Client as InstagramClient

class InstagramBot:
    """Instagram Bot Service Class"""

    def __init__(self):
        """Initialize the Instagram Bot"""
        self.logger = logging.getLogger(__name__)

        # Load environment variables - require all to be set
        required_env_vars = ["INSTAGRAM_USER", "INSTAGRAM_PASSWORD", "SUPABASE_URL", "SUPABASE_KEY"]
        for var in required_env_vars:
            if not os.getenv(var):
                self.logger.error(f"Missing required environment variable: {var}")
                sys.exit(1)

        # Load environment variables
        self.instagram_user = os.getenv("INSTAGRAM_USER")
        self.instagram_password = os.getenv("INSTAGRAM_PASSWORD")
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_KEY")

        # Initialize Supabase client with error handling
        try:
            self.supabase = create_client(self.supabase_url, self.supabase_key)
            # Test connection
            response = self.supabase.table('triggers').select('id', limit=1).execute()
            if response.get('error'):
                self.logger.error(f"Supabase connection test failed: {response['error']}")
                sys.exit(1)
        except Exception as e:
            self.logger.error(f"Failed to initialize Supabase client: {e}")
            sys.exit(1)

        # Initialize Instagram API client
        self.instagram_api = self._initialize_instagram_api()
        if not self.instagram_api:
            self.logger.error("Failed to initialize Instagram API client")
            sys.exit(1)

        self.logger.info("Instagram Bot initialized")

    def _initialize_instagram_api(self):
        """Initialize the Instagram API client with error handling"""
        self.logger.info("Initializing Instagram API client")
        try:
            # Create Instagram API client with proper authentication
            self.instagram_api = InstagramClient(
                self.instagram_user,
                self.instagram_password
            )
            # Test connection
            self.instagram_api.get_self_info()
            self.logger.info("Instagram API client initialized successfully")
            return self.instagram_api
        except Exception as e:
            self.logger.error(f"Failed to initialize Instagram API: {e}")
            # Perform cleanup if needed
            if hasattr(self, 'instagram_api') and self.instagram_api:
                try:
                    self.instagram_api.close()
                except:
                    self.logger.error("Failed to clean up Instagram API client")
            return None

    def run(self):
        """Run the bot's main functionality"""
        self.logger.info("Running bot service")

        # Fetch active triggers from Supabase
        triggers = self._fetch_active_triggers()
        if not triggers:
            self.logger.warning("No active triggers found")
            return

        # Fetch active templates from Supabase
        templates = self._fetch_active_templates()
        if not templates:
            self.logger.warning("No active templates found")
            return

        # Monitor Instagram comments and process them
        self._process_instagram_comments(triggers, templates)

    def _fetch_active_triggers(self):
        """Fetch active triggers from Supabase"""
        self.logger.info("Fetching active triggers from Supabase")
        try:
            response = self.supabase.table('triggers').select('*').execute()
            if response.get('error'):
                self.logger.error(f"Error fetching triggers: {response['error']}")
                return []

            triggers = response.get('data', [])
            active_triggers = [t for t in triggers if t.get('is_active', False)]
            self.logger.info(f"Found {len(active_triggers)} active triggers")
            return active_triggers
        except Exception as e:
            self.logger.error(f"Exception fetching triggers: {e}")
            return []

    def _fetch_active_templates(self):
        """Fetch active templates from Supabase"""
        self.logger.info("Fetching active templates from Supabase")
        try:
            response = self.supabase.table('templates').select('*').execute()
            if response.get('error'):
                self.logger.error(f"Error fetching templates: {response['error']}")
                return []

            templates = response.get('data', [])
            active_templates = [t for t in templates if t.get('is_active', False)]
            self.logger.info(f"Found {len(active_templates)} active templates")
            return active_templates
        except Exception as e:
            self.logger.error(f"Exception fetching templates: {e}")
            return []

    # ROO-AUDIT-TAG :: plan-001-comment-monitoring.md :: Implement comment monitoring
    def _process_instagram_comments(self, triggers, templates):
        """Process Instagram comments based on triggers"""
        self.logger.info("Processing Instagram comments")

        # Get recent comments from monitored posts
        try:
            comments_response = self.instagram_api.feed_comments()
            if not isinstance(comments_response, list):
                self.logger.error(f"Invalid response format: {type(comments_response)}")
                return

            comments = comments_response
            self.logger.info(f"Found {len(comments)} recent comments")
        except Exception as e:
            self.logger.error(f"Failed to fetch comments: {e}")
            return

        # Process each comment
        for comment in comments:
            comment_text = comment.get('text', '').lower()
            comment_user_id = comment.get('user_id')
            post_id = comment.get('post_id')

            # ROO-AUDIT-TAG :: plan-002-keyword-matching.md :: Implement keyword matching
            # Check if the comment contains any trigger keywords
            for trigger in triggers:
                keyword = trigger.get('keyword', '').lower()
                if keyword in comment_text:
                    self.logger.info(f"Trigger keyword '{keyword}' found in comment")

                    # Find the appropriate template
                    template = next((t for t in templates if t.get('trigger_id') == trigger.get('id')), None)
                    if template:
                        self.logger.info(f"Using template: {template.get('content', '')}")

                        # Send a DM
                        self._send_dm(comment_user_id, template, post_id)

                        # Log activity
                        self._log_activity(comment, trigger, template)
                    else:
                        self.logger.warning(f"No template found for trigger ID: {trigger.get('id')}")
                    break
            else:
                self.logger.info("No trigger keywords found in comment")
            # ROO-AUDIT-TAG :: plan-002-keyword-matching.md :: END
    # ROO-AUDIT-TAG :: plan-001-comment-monitoring.md :: END

    # ROO-AUDIT-TAG :: plan-003-dm-response.md :: Implement DM response
    def _send_dm(self, user_id, template, post_id=None):
        """Send a direct message to an Instagram user"""
        self.logger.info(f"Sending DM to user {user_id}")

        # Get the message content from the template
        message = template.get('content', '')

        # Validate message content
        if not message or len(message) > 1000:
            self.logger.error("Invalid message content")
            return

        # Send the DM using Instagram API
        try:
            if self.instagram_api:
                response = self.instagram_api.direct_messages.create(user_id, message)
                if response.get('status') == 'ok':
                    self.logger.info(f"Message sent: {message}")
                else:
                    self.logger.error(f"Failed to send DM: {response.get('error')}")
            else:
                self.logger.error("Instagram API client not initialized")
        except Exception as e:
            self.logger.error(f"Failed to send DM: {e}")
            # Implement retry logic for transient errors
            try:
                self.logger.info("Retrying DM send...")
                response = self.instagram_api.direct_messages.create(user_id, message)
                if response.get('status') == 'ok':
                    self.logger.info("Retry successful")
                else:
                    self.logger.error(f"Retry failed: {response.get('error')}")
            except Exception as retry_e:
                self.logger.error(f"Retry failed: {retry_e}")
    # ROO-AUDIT-TAG :: plan-003-dm-response.md :: END

    def _log_activity(self, comment, trigger, template):
        """Log bot activity to Supabase"""
        self.logger.info("Logging activity to Supabase")

        activity_data = {
            "comment_id": comment.get("post_id"),
            "user_id": comment.get("user_id"),
            "trigger_id": trigger.get("id"),
            "template_id": template.get("id"),
            "action": "sent_dm",
            "details": f"Responded to '{comment.get('text', '')}' with template '{template.get('content', '')}'"
        }

        try:
            response = self.supabase.table('activity_log').insert(activity_data).execute()
            if response.get('error'):
                self.logger.error(f"Error logging activity: {response['error']}")
            else:
                self.logger.info("Activity logged successfully")
        except Exception as e:
            self.logger.error(f"Exception logging activity: {e}")
# ROO-AUDIT-TAG :: plan-011-bot-fixes.md :: END