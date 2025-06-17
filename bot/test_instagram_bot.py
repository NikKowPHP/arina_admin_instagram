import unittest
from unittest.mock import Mock, patch
from bot.instagram_bot import InstagramBot

class TestInstagramBot(unittest.TestCase):
    @patch('instagram_bot.psycopg2.connect')
    def test_fetch_triggers_includes_template_id(self, mock_connect):
        # Setup mock database connection and cursor
        mock_conn = Mock()
        mock_cursor = Mock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        # Mock the fetchall result
        expected_triggers = [
            ('trigger1', 'post1', 'keyword1', 'template1'),
            ('trigger2', 'post2', 'keyword2', 'template2')
        ]
        mock_cursor.fetchall.return_value = expected_triggers
        
        # Initialize bot and fetch triggers
        bot = InstagramBot()
        bot.connect_to_database()
        triggers = bot.fetch_triggers()
        
        # Verify the SQL query includes template_id
        mock_cursor.execute.assert_called_once_with(
            "SELECT id, post_id, keyword, template_id FROM triggers WHERE is_active = TRUE"
        )
        
        # Verify the returned triggers include template_id
        self.assertEqual(triggers, expected_triggers)

if __name__ == '__main__':
    unittest.main()