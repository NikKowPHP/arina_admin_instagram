# Instagram Comment-to-DM Bot System

Automatically send DMs to users who comment with specific keywords on Instagram posts. Includes an admin panel for managing triggers and responses.

## Features
- Instagram bot service (Python)
- Admin web panel (Next.js)
- Supabase backend (Auth, Database, Storage)
- Dockerized development environment

## Prerequisites
- Docker and Docker Compose
- Instagram API credentials
- Supabase account

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/arina_admin_instagram.git
   cd arina_admin_instagram
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env` in both `admin/admin` and bot directories
   - Fill in your credentials:
     - Instagram API keys
     - Supabase URL and anon key
     - Admin panel secret keys

3. **Start the system**
   ```bash
   docker-compose up --build
   ```

4. **Access the services**
   - Admin panel: http://localhost:3111
   - Bot logs: `docker-compose logs bot`

## Configuration

### Admin Panel
1. Visit http://localhost:3111/login
2. Create your admin account
3. Configure:
   - Instagram posts to monitor
   - Trigger keywords
   - DM response templates

### Instagram Bot
1. Ensure your Instagram account is properly authenticated
2. The bot will automatically:
   - Monitor specified posts
   - Detect trigger keywords
   - Send configured DM responses

## Troubleshooting

**Common Issues:**
- Instagram API limits: Ensure proper rate limiting
- Database connection: Verify Supabase credentials
- Docker issues: Check container logs with `docker-compose logs`

For full documentation, see the `/docs` directory.