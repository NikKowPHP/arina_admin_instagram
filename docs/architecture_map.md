# Architecture Map

## Features

### Authentication
- Status: [IMPLEMENTED]
- Description: admin panel login and session management
- Files:
  - src/app/login/page.tsx
  - src/lib/supabase.ts

### Trigger Management
- Status: [IMPLEMENTED]
- Description: CRUD for comment response triggers
- Files:
  - src/app/api/triggers/[[...slug]]/route.ts
  - src/components/trigger-list.tsx

### Template Management
- Status: [IMPLEMENTED]
- Description: CRUD for DM templates
- Files:
  - src/app/api/templates/[[...slug]]/route.ts
  - src/app/dashboard/templates/page.tsx

### Bot Service
- Status: [IMPLEMENTED]
- Description: Instagram comment monitoring and response
- Files:
  - src/bot-monitor/service.ts
  - instagram_bot/instagram_bot.py

### Dashboard
- Status: [IMPLEMENTED]
- Description: real-time analytics and monitoring
- Files:
  - src/app/dashboard/page.tsx
  - src/components/ui/charts.tsx