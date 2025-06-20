# Task: DM Response Implementation (Bot Service)

## Overview
Implement DM sending functionality with rate limiting and media support.

## Tasks
1. Create DM sending function with Instagram API
2. Implement rate limiting per user (configurable window)
3. Add media attachment support (images/videos)
4. Create dead-letter queue for failed messages
5. Implement admin alerting for critical failures
6. Write unit tests for DM sending functionality

## Files to Modify/Create
- `instagram_bot/instagram_bot.py` (DM sending logic)
- `instagram_bot/rate_limiter.py` (rate limiting implementation)
- `instagram_bot/tests/test_dm_sending.py` (unit tests)