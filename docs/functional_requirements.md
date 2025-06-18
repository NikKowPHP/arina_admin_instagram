# Functional Requirements

## Instagram Bot Functionality

### Comment Monitoring
- Continuously polls Instagram API for new comments
- Filters comments based on:
  - Post ID (configured triggers only)
  - Keyword matches (exact and partial matches)
  - User eligibility (exclude blocked users)

### Keyword Matching
- Supports:
  - Exact match triggers (e.g., "WIN")
  - Partial match triggers (e.g., "promo*")
  - Case-insensitive matching
- Priority system for multiple matches

### DM Response System
- Selects appropriate template based on:
  - Matched keyword
  - User history (avoid duplicates)
- Sends DM containing:
  - Preconfigured text
  - Optional media attachment
  - Tracking pixel for analytics
- Rate limiting: Max 1 DM per user per hour

## Admin Panel Features

### Authentication
- Supabase email/password login
- Session management (30min timeout)
- Role-based access (Admin/Viewer)

### Trigger Management
- CRUD operations for:
  - Post IDs to monitor
  - Trigger keywords
  - Response templates
- Activation toggle per trigger
- Bulk import/export via CSV

### Template Management
- Create/edit DM templates with:
  - Text content (markdown supported)
  - Media attachments (images/videos)
  - Tracking parameters
- Preview functionality
- Version history

### Dashboard
- Real-time metrics:
  - Total triggers activated
  - DMs sent (success/failure)
  - Popular keywords
- System health monitoring

## System Constraints
- Instagram API rate limits:
  - Max 200 comments/min
  - Max 30 DMs/min
- Local storage limits:
  - 1GB media cache
  - 7d activity logs
- Performance targets:
  - <2s response time for admin panel
  - <5s DM delivery after comment

## Error Handling
- Failed DM retries (3 attempts)
- Invalid comment skipping
- API outage recovery:
  - 15min backoff period
  - Local queue for pending DMs
- Admin alerts for:
  - Continuous failures
  - Storage limits
  - Auth breaches