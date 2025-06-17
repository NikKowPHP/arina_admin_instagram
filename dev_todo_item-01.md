# Development Plan for Ticket 1: Implement Core Instagram Bot Service

## Objective
Implement a Python-based Instagram bot service that monitors comments, matches keywords, and sends automated DMs.

## Steps

1. **Create Python application structure**
   - Create `/bot` directory with required files:
     - `Dockerfile` (for containerization)
     - `requirements.txt` (dependencies)
     - `main.py` (entry point)
     - `instagram_bot.py` (core functionality)
     - `.env.example` (environment variables)

## Dependencies
- Python 3.10+
- Libraries: instagrapi, python-dotenv, psycopg2 (PostgreSQL), requests

## Notes
- Use environment variables for all credentials
- Follow Instagram API best practices to avoid bans
- Implement proper backoff strategies for rate limits
- All database operations should use parameterized queries