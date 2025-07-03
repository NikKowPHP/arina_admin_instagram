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
        # --- ADD THIS LINE ---
    print("---- DUMPING ENVIRONMENT VARIABLES ----")
    import os
    print(os.environ)
    print("---------------------------------------")
    # ---------------------
    logger.info("Starting Instagram bot service...")
  




    # Initialize the bot
    bot = InstagramBot()

    # Determine run mode from environment (default to 'single' for cloud)
    run_mode = os.getenv("RUN_MODE", "single").lower()
    logger.info(f"Running in {run_mode} mode")

    # Start the bot in appropriate mode
    if run_mode == "continuous":
        bot.run_continuously()
    else:
        bot.run_single_check()

def check_health():
    """Check if the bot can connect to the database."""
    try:
        bot = InstagramBot()
        bot.connect_to_database()
        print("healthy")
        exit(0)
    except Exception as e:
        print(f"healthcheck failed: {str(e)}")
        exit(1)

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "check_health":
        check_health()
    else:
        main()