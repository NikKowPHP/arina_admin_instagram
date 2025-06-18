# API Specification

## Admin Panel API (Next.js Routes)

### Authentication
- All routes require valid JWT from Supabase Auth
- Token passed in `Authorization` header

### Trigger Management
`POST /api/triggers`
```json
{
  "post_id": "INSTAGRAM_POST_ID",
  "keyword": "WIN",
  "template_id": "UUID",
  "is_active": true
}
```
Response:
```json
{
  "id": "UUID",
  "created_at": "ISO8601"
}
```

`GET /api/triggers?post_id=INSTAGRAM_POST_ID`
```json
[
  {
    "id": "UUID",
    "keyword": "WIN",
    "template": { /* template object */ },
    "is_active": true
  }
]
```

### Template Management
`POST /api/templates`
```json
{
  "content": "Congrats! You won!",
  "media_url": "https://storage.example.com/prize.jpg"
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