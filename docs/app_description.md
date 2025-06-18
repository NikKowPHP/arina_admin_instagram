# Instagram Comment-to-DM Bot System

## Project Vision
Create an automated system where:
1. Users commenting with specific keywords on Instagram posts receive automated DMs
2. Admins can manage triggers and DM content through a web panel
3. Entire system runs locally via Docker for easy testing

## Core Components
### Instagram Bot
- Python-based service monitoring Instagram comments
- Matches comments against admin-defined keywords
- Sends pre-configured DM responses (text/media) to matching users
- Runs in background 24/7

### Admin Panel
- Next.js 14 application with App Router
- Authentication via Supabase Auth
- CRUD operations for:
  - Instagram post triggers (keywords)
  - DM response templates (text/media)
  - Activation status
- Dashboard showing trigger statistics
- Tailwind CSS for styling

### Database & Storage
- Supabase PostgreSQL for:
  - User accounts (Supabase Auth)
  - Trigger configurations
  - DM templates
- Supabase Storage for media files in DMs

## Tech Stack
### Backend Services
- Instagram Bot: Python + Instagram API wrapper
- Admin API: Next.js API routes

### Frontend
- Next.js 14
- Tailwind CSS
- Prisma ORM

### Infrastructure
- Docker Compose for local development
- Supabase for:
  - Authentication
  - Database
  - File storage

## Key Requirements
1. Single-command startup: `docker-compose up`
2. Isolated services:
   - Admin panel (Next.js)
   - Instagram bot (Python)
   - Database (Supabase local)
3. Secure admin authentication
4. Configurable triggers/DM content