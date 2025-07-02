# API Specification

## Admin Panel API (Next.js Routes)

### Authentication
- All routes require valid JWT from Supabase Auth
- Token passed in `Authorization` header

### Trigger Management
`POST /api/triggers`
```json
{
  "postId": "INSTAGRAM_POST_ID",
  "keyword": "WIN",
  "userId": "OPTIONAL_USER_ID",
  "templateId": "TEMPLATE_UUID"
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
    "postId": "INSTAGRAM_POST_ID",
    "keyword": "WIN",
    "userId": "OPTIONAL_USER_ID",
    "templateId": "TEMPLATE_UUID",
    "isActive": true
  }
]
```

`GET /api/triggers/:id`
```json
{
  "id": "UUID",
  "postId": "INSTAGRAM_POST_ID",
  "keyword": "WIN",
  "userId": "OPTIONAL_USER_ID",
  "templateId": "TEMPLATE_UUID",
  "isActive": true
}
```

`PUT /api/triggers/:id`
```json
{
  "postId": "UPDATED_POST_ID",
  "keyword": "UPDATED_KEYWORD",
  "userId": "UPDATED_USER_ID",
  "templateId": "UPDATED_TEMPLATE_ID",
  "isActive": false
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
  "content": "Template content",
  "media_url": "https://example.com/media.jpg"
}
```

`GET /api/templates`
```json
[
  {
    "id": "UUID",
    "name": "Template Name",
    "content": "Template content",
    "media_url": "https://example.com/media.jpg"
  }
]
```

`GET /api/templates/:id`
```json
{
  "id": "UUID",
  "name": "Template Name",
  "content": "Template content",
  "media_url": "https://example.com/media.jpg"
}
```

`PUT /api/templates/:id`
```json
{
  "name": "Updated Template Name",
  "content": "Updated content",
  "media_url": "https://example.com/updated.jpg"
}
```

`DELETE /api/templates/:id`
Response:
```json
{
  "message": "Template deleted successfully"
}
```

## Storage API

`POST /api/storage/upload`
- Protected route (requires valid JWT)
- Accepts `FormData` with a single file field named `file`
- Returns:
```json
{
  "publicUrl": "https://your-project-ref.supabase.co/storage/v1/object/public/templates/filename.ext"
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