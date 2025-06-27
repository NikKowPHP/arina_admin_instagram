#!/usr/bin/env python3
"""
Instagram Bot Service Main Entry Point
"""

import os
import sys
import logging
import time
from instagram_bot import InstagramBot

def setup_logging():
    """Set up logging configuration"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler("logs/system_events.log"),
            logging.StreamHandler(sys.stdout)
        ]
    )

def main():
    """Main function to run the Instagram bot service"""
    setup_logging()
    logger = logging.getLogger(__name__)

    logger.info("Starting Instagram Bot Service")

    # Initialize the bot
    bot = InstagramBot()

    # Run the bot in a loop
    try:
        while True:
            bot.run()
            time.sleep(60)  # Run every minute
    except KeyboardInterrupt:
        logger.info("Bot service stopped by user")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()