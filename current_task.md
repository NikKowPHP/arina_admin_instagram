# Current Task: Refactor Instagram Bot Implementation

## Task Description
Address the refactoring requirements outlined in NEEDS_REFACTOR.md

## Step-by-Step Plan

1. **Security - Remove Hardcoded Credentials**
   - Remove ENV lines for INSTAGRAM_USER and INSTAGRAM_PASSWORD from Dockerfile
   - Add validation in instagram_bot.py to check these variables exist on startup

2. **Core Functionality - Implement Instagram API**
   - Add instagram-private-api to requirements.txt
   - Implement Instagram API client for comment monitoring and DM sending
   - Add proper authentication flow

3. **Error Handling - Supabase Client**
   - Add try-except blocks around Supabase client initialization
   - Implement connection test on startup
   - Add retry logic for failed queries

4. **Configuration - Database URL**
   - Remove SUPABASE_URL from Dockerfile
   - Require it to be passed as environment variable
   - Update default in instagram_bot.py to actual Supabase URL

5. **Finalize and Commit**
   - Delete NEEDS_REFACTOR.md
   - Create COMMIT_COMPLETE.md
   - Handoff to orchestrator