# Deployment Guide

## System Requirements
- Python 3.8+
- PostgreSQL 12+
- Node.js 16+ (for admin interface)

## Installation
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

## Running the Application
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

### Test Configuration
The test configuration is located in `instagram_bot/tests/test_config.py`. This file contains mock credentials and settings for testing.