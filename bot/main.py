#!/usr/bin/env python3

import os
import logging
from dotenv import load_dotenv
from instagram_bot import InstagramBot

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("bot.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def main():
    """Main function to run the Instagram bot."""
    logger.info("Starting Instagram bot service...")

    # Initialize the bot
    bot = InstagramBot()

    # Start the bot
    bot.run()

if __name__ == "__main__":
    main()