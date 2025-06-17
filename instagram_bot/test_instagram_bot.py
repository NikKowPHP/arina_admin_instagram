import unittest
import logging
from unittest.mock import Mock
from instagram_bot.instagram_bot import InstagramBot, logger as bot_logger
from .tests.mock_services import MockDatabase, MockInstagramAPI

class TestInstagramBot(unittest.TestCase):
    def setUp(self):
        self.bot = InstagramBot()
        # Replace real services with mocks
        self.bot.db_conn = MockDatabase()
        self.bot.client = MockInstagramAPI()
        # Mock other dependencies
        self.bot.fetch_triggers = Mock()
        self.bot.fetch_templates = Mock()
        self.bot.log_activity = Mock()
        self.bot.run = Mock(wraps=self.bot.run)
        
        # Set dummy credentials to avoid login errors
        self.bot.instagram_user = "test_user"
        self.bot.instagram_password = "test_pass"

    def test_fetch_triggers_includes_template_id(self):
        # Setup mock database response
        expected_triggers = [
            ('trigger1', 'post1', 'keyword1', 'template1'),
            ('trigger2', 'post2', 'keyword2', 'template2')
        ]
        self.bot.db_conn.cursor().fetchall.return_value = expected_triggers
        
        # Fetch triggers
        triggers = self.bot.fetch_triggers()
        
        # Verify the SQL query includes template_id
        self.bot.db_conn.cursor().execute.assert_called_once_with(
            "SELECT id, post_id, keyword, template_id FROM triggers WHERE is_active = TRUE"
        )
        
        # Verify the returned triggers include template_id
        self.assertEqual(triggers, expected_triggers)

    def test_run_with_trigger_missing_template_id(self):
        """Test run loop when trigger has no template_id assigned"""
        # Setup
        self.bot.fetch_triggers.return_value = [
            ('trigger1', 'post1', 'keyword1', None),  # No template_id
            ('trigger2', 'post2', 'keyword2', 'template2')
        ]
        self.bot.fetch_templates.return_value = [('template2', 'Content', None)]
        
        # Simulate finding a comment
        self.bot.client.check_comments.return_value = [Mock(user=Mock(id='user1'))]
        
        # Run one iteration
        with self.assertLogs(bot_logger, level='ERROR') as log:
            self.bot.run()
        
        # Verify error was logged for trigger1
        self.assertIn("has no template_id assigned", log.output[0])
        # Verify DM was only sent for trigger2
        self.bot.send_dm.assert_called_once_with('user1', {'content': 'Content', 'media_url': None})

    def test_run_with_template_not_found(self):
        """Test run loop when template_id not found in templates_dict"""
        # Setup
        self.bot.fetch_triggers.return_value = [
            ('trigger1', 'post1', 'keyword1', 'missing_template'),
        ]
        self.bot.fetch_templates.return_value = [('template2', 'Content', None)]
        
        # Simulate finding a comment
        self.bot.client.check_comments.return_value = [Mock(user=Mock(id='user1'))]
        
        # Run one iteration
        with self.assertLogs(bot_logger, level='ERROR') as log:
            self.bot.run()
        
        # Verify error was logged
        self.assertIn("No template found with ID", log.output[0])
        # Verify no DM was sent
        self.bot.send_dm.assert_not_called()

if __name__ == '__main__':
    unittest.main()