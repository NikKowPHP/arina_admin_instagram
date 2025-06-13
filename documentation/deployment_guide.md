# Deployment Guide

## Prerequisites
- Docker 20.10+
- Docker Compose 2.20+
- 4GB RAM minimum

## Quick Start
```bash
# Clone repository
git clone https://github.com/your-repo/instagram-bot.git
cd instagram-bot

# Start services
docker-compose up -d
```

## Docker Compose Configuration
```yaml
version: '3.8'

services:
  admin-panel:
    image: node:18
    working_dir: /app
    volumes:
      - ./admin:/app
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/postgres
    depends_on:
      - db

  bot-service:
    image: python:3.10
    working_dir: /app
    volumes:
      - ./bot:/app
    environment:
      - INSTAGRAM_USER=your_username
      - INSTAGRAM_PASSWORD=your_password
    depends_on:
      - db

  db:
    image: supabase/postgres:15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_PASSWORD=password
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## Environment Variables

### Admin Panel (Next.js)
```env
NEXT_PUBLIC_SUPABASE_URL=http://db:5432
NEXT_PUBLIC_SUPABASE_KEY=your-anon-key
```

### Bot Service
```env
INSTAGRAM_USER=your_instagram_username
INSTAGRAM_PASSWORD=your_instagram_password
POLL_INTERVAL=60 # seconds
```

## Initial Setup
1. Create admin user:
```bash
docker-compose exec admin-panel npm run create-admin
```

2. Import initial triggers (optional):
```bash
docker-compose exec admin-panel npm run import-triggers triggers.csv
```

## Testing
1. Verify services are running:
```bash
docker-compose ps
```

2. Check admin panel:
```bash
curl http://localhost:3000/api/health
```

3. Test bot service:
```bash
docker-compose exec bot-service python test_bot.py
```

## Troubleshooting
Common issues:
- Instagram API limits: Check bot logs
```bash
docker-compose logs bot-service
```
- Database connection issues: Verify credentials
- Admin panel not loading: Check Next.js build
```bash
docker-compose exec admin-panel npm run build