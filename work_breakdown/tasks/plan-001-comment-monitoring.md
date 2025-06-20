# Task: Comment Monitoring Implementation (Bot Service)

## Overview
Implement continuous polling of Instagram API for new comments on configured posts. Store processed comments to avoid duplicates.

## Tasks
1. Create Instagram API client with authentication
2. Implement comment polling mechanism
3. Store processed comment IDs in database
4. Add rate limiting to comply with Instagram API limits
5. Write unit tests for comment polling functionality

## Files to Modify/Create
- `instagram_bot/instagram_bot.py` (main implementation)
- `instagram_bot/tests/test_comment_monitoring.py` (unit tests)
- `prisma/schema.prisma` (database schema)