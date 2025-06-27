# API Specification

## Admin Panel API (Next.js Routes)

### Authentication
- All routes require valid JWT from Supabase Auth
- Token passed in `Authorization` header

### Trigger Management
`POST /api/triggers`
```json
{
  "name": "Trigger Name",
  "condition": "Keyword or condition",
  "action": "Action to perform"
}
```
Response:
```json
{
  "id": "UUID",
  "created_at": "ISO8601"
}
```

`GET /api/triggers`
```json
[
  {
    "id": "UUID",
    "name": "Trigger Name",
    "condition": "Keyword or condition",
    "action": "Action to perform"
  }
]
```

`GET /api/triggers/:id`
```json
{
  "id": "UUID",
  "name": "Trigger Name",
  "condition": "Keyword or condition",
  "action": "Action to perform"
}
```

`PUT /api/triggers/:id`
```json
{
  "name": "Updated Trigger Name",
  "condition": "Updated condition",
  "action": "Updated action"
}
```

`DELETE /api/triggers/:id`
Response:
```json
{
  "message": "Trigger deleted successfully"
}
```

### Template Management
`POST /api/templates`
```json
{
  "name": "Template Name",
  "content": "Template content"
}
```

`GET /api/templates`
```json
[
  {
    "id": "UUID",
    "name": "Template Name",
    "content": "Template content"
  }
]
```

`GET /api/templates/:id`
```json
{
  "id": "UUID",
  "name": "Template Name",
  "content": "Template content"
}
```

`PUT /api/templates/:id`
```json
{
  "name": "Updated Template Name",
  "content": "Updated content"
}
```

`DELETE /api/templates/:id`
Response:
```json
{
  "message": "Template deleted successfully"
}
```

## Bot Service API (Python)

### Health Check
`GET /bot/health`
```json
{
  "status": "ok",
  "last_check": "ISO8601",
  "queued_messages": 5
}
```

### Configuration
`GET /bot/config`
```json
{
  "active_triggers": [
    {
      "post_id": "INSTAGRAM_POST_ID",
      "keyword": "WIN",
      "template": { /* template object */ }
    }
  ]
}
```

## Supabase Integration

### Authentication
`POST /auth/v1/token?grant_type=password`
```json
{
  "email": "admin@example.com",
  "password": "secret"
}
```

### Storage
`POST /storage/v1/object/templates/{filename}`
- Requires Bearer token
- Max file size: 10MB
- Allowed types: image/jpeg, image/png, video/mp4

## Error Responses
Common error formats:
```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description"
}
```

### Status Codes
- 401 Unauthorized - Invalid/missing token
- 403 Forbidden - Insufficient permissions
- 429 Too Many Requests - Rate limit exceeded