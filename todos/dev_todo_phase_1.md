# Development Tasks: Phase 1 - Project Setup and Infrastructure

## 1. Set up Docker Compose environment
- [x] **Task: Docker Compose Setup**
**Modify [`docker-compose.yml`](docker-compose.yml)**: Create a new Docker Compose file with the following content:
```yaml
version: '3.8'

services:
  admin-panel:
    build: 
      context: ./admin
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/postgres
    depends_on:
      - db
    volumes:
      - ./admin:/app

  bot-service:
    build: 
      context: ./bot
    environment:
      - INSTAGRAM_USER=${INSTAGRAM_USER:-testuser}
      - INSTAGRAM_PASSWORD=${INSTAGRAM_PASSWORD:-testpass}
    depends_on:
      - db
    volumes:
      - ./bot:/app

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
**Verification:** Confirm the file exists with the correct content.

## 2. Configure Supabase local instance
- [x] **Task: Supabase Configuration**
**Create [`supabase/config.toml`](supabase/config.toml)**: Add basic configuration:
```toml
[api]
port = 5432

[auth]
site_url = "http://localhost:3000"
```
**Execute Command:** 
```bash
docker-compose up -d db
```
**Verification:** Check that the Supabase container is running with `docker-compose ps`.

## 3. Initialize Next.js admin panel
**Execute Command in `admin` directory:**
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```
**Modify [`admin/.env`](admin/.env)**: Add environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=http://db:5432
NEXT_PUBLIC_SUPABASE_KEY=your-anon-key
```
**Verification:** Confirm Next.js app structure exists in `admin` directory.

## 4. Create Python bot service skeleton
**Create [`bot/requirements.txt`](bot/requirements.txt)**:
```
instagram-private-api==1.6.0
python-dotenv==1.0.0
```
**Create [`bot/main.py`](bot/main.py)**:
```python
import os
from dotenv import load_dotenv

load_dotenv()

INSTAGRAM_USER = os.getenv("INSTAGRAM_USER")
INSTAGRAM_PASSWORD = os.getenv("INSTAGRAM_PASSWORD")

print(f"Bot service started for user: {INSTAGRAM_USER}")
```
**Create [`bot/Dockerfile`](bot/Dockerfile)**:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "main.py"]
```
**Verification:** Confirm all bot files exist with correct content.