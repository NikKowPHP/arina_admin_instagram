from unittest.mock import Mock

class MockInstagramAPI:
    def __init__(self):
        self.check_comments = Mock(return_value=[])
        self.login = Mock()
        self.send_dm = Mock()

    def set_comments(self, comments):
        self.check_comments.return_value = comments

class MockDatabase:
    def __init__(self):
        self.cursor = Mock()
        self.cursor().execute = Mock()
        self.cursor().fetchall = Mock(return_value=[])
        self.commit = Mock()

    def set_query_results(self, results):
        self.cursor().fetchall.return_value = results