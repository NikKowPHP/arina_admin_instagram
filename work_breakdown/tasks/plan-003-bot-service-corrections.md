# Development Plan for Ticket 7-10: Bot Service Corrections

## Objective
Address missing core features in the Instagram bot service identified during audit.

## Tasks

### Ticket 7: Implement Media Support in DMs (COMPLETED)
- [x] **(LOGIC)** Update `send_dm` method in [`instagram_bot/instagram_bot.py`](instagram_bot/instagram_bot.py) to handle media URLs
- [x] **(LOGIC)** Add media URL validation in [`instagram_bot/instagram_bot.py`](instagram_bot/instagram_bot.py)
- [x] **(LOGIC)** Update template schema to include `media_url` field
- [x] **(LOGIC)** Implement media attachment logic using Instagram API

### Ticket 8: Add Rate Limiting (COMPLETED)
- [x] **(LOGIC)** Create rate limiting decorator in [`instagram_bot/instagram_bot.py`](instagram_bot/instagram_bot.py)
- [x] **(LOGIC)** Track DM send timestamps per user
- [x] **(LOGIC)** Implement configurable rate limits via environment variables
- [x] **(LOGIC)** Add proper error handling for rate-limited cases

### Ticket 9: Handle Duplicate Comments (COMPLETED)
- [x] **(LOGIC)** Implement comment tracking system in [`instagram_bot/instagram_bot.py`](instagram_bot/instagram_bot.py)
- [x] **(LOGIC)** Store processed comment IDs in database
- [x] **(LOGIC)** Add duplicate detection before sending DMs

### Ticket 10: Improve Error Handling (COMPLETED)
- [x] **(LOGIC)** Implement dead-letter queue for failed DMs
- [x] **(LOGIC)** Add admin alerting system for critical errors
- [x] **(LOGIC)** Enhance logging throughout the bot service

## Dependencies
- Instagram API media attachment capabilities
- Database schema updates for new fields
- Updated admin panel template management

## Notes
- Maintain backwards compatibility with existing templates
- Ensure all new features are properly tested
- Update documentation for new functionality