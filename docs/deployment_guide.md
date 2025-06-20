# Deployment Guide

## System Requirements
- Python 3.8+
- PostgreSQL 12+
- Node.js 16+ (for admin interface)
- Docker 20+ (for containerized deployment)

## Installation

### Option 1: Traditional Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/arina_admin_instagram.git
   cd arina_admin_instagram
   ```

2. Set up Python environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r instagram_bot/requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp instagram_bot/.env.example instagram_bot/.env
   # Edit the .env file with your credentials
   ```

4. Set up database:
   ```bash
   # Create and migrate database using Supabase CLI
   cd supabase
   supabase start
   ```

### Option 2: Docker Installation (Recommended)
1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/arina_admin_instagram.git
   cd arina_admin_instagram
   ```

2. Set up environment variables:
   ```bash
   cp instagram_bot/.env.example instagram_bot/.env
   # Edit the .env file with your credentials
   ```

3. Build and start the services using Docker Compose:
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build and start the Instagram bot service
   - Build and start the admin panel service
   - Set up and start the PostgreSQL database
   - Configure networking between services
   - Add healthchecks for all services

## Running the Application

### Traditional Setup
1. Start the Instagram bot:
   ```bash
   cd instagram_bot
   python main.py
   ```

2. Start the admin interface:
   ```bash
   cd admin/admin
   npm install
   npm run dev
   ```

### Docker Setup
All services will be started automatically when you run:
```bash
docker-compose up
```

You can access:
- Admin panel at http://localhost:3000
- Bot service API at http://localhost:8000

## Testing

### Python Environment Setup
1. Create virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running Tests
Execute tests with mocks:
```bash
pytest instagram_bot/tests --disable-pytest-warnings
```

### Docker Integration Tests
Run integration tests to verify the Docker setup:
```bash
pytest tests/docker_integration_test.py
```

### Test Configuration
The test configuration is located in `instagram_bot/tests/test_config.py`. This file contains mock credentials and settings for testing.