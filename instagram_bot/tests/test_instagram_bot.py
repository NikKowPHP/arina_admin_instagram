import pytest
from instagram_bot.instagram_bot import InstagramBot

def test_instagram_bot_initialization():
    bot = InstagramBot()
    assert bot is not None
    assert bot.instagram_user is not None
    assert bot.instagram_password is not None