# Task: Bot Service Fixes

## Overview
Address issues identified in the audit:
1. Remove placeholder code and TODOs
2. Fix missing imports
3. Implement dead-letter queue/alerting
4. Verify database schema

## Tasks
1. Remove TODO at [`instagram_bot/instagram_bot.py:302`](instagram_bot/instagram_bot.py:302)
2. Add missing import for `requests` module
3. Implement dead-letter queue for failed DMs
4. Add admin alerting for critical errors
5. Verify database schema matches implementation
6. Write unit tests for fixes

## Files to Modify
- [`instagram_bot/instagram_bot.py`](instagram_bot/instagram_bot.py)
- [`admin/admin/prisma/schema.prisma`](admin/admin/prisma/schema.prisma)
- `instagram_bot/tests/test_bot_fixes.py`