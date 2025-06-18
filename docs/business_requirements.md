# Business Requirements Document

## Project Overview
Automated Instagram engagement system that:
- Sends DMs to users who comment with specific keywords
- Provides admins with web-based control panel for configuration
- Runs locally via Docker for easy testing

## Key Objectives
1. Increase user engagement through automated responses
2. Simplify campaign management for admins
3. Ensure system reliability and scalability
4. Maintain secure access to admin features

## Stakeholders
- **Instagram Users**: Receive automated DMs based on comments
- **Marketing Admins**: Manage trigger keywords and DM content
- **Developers**: Maintain and extend system functionality

## User Stories

### Instagram User Perspective
- As a user, I want to receive relevant DMs when I comment with specific keywords
- As a user, I want the DM content to match the keyword I used
- As a user, I want to receive media attachments in DMs when available

### Admin Perspective
- As an admin, I want to:
  - Create/edit/delete trigger keywords
  - Manage DM templates (text + media)
  - Monitor bot activity
  - Toggle triggers on/off
- As an admin, I need secure login to the control panel
- As an admin, I want to see statistics on trigger usage

## Success Metrics
1. 80% of keyword comments receive DMs within 5 minutes
2. Admin can configure new triggers in under 2 minutes
3. System uptime of 99.9% during campaign periods
4. Zero unauthorized access to admin panel

## Key Features

### Instagram Bot
- Real-time comment monitoring
- Keyword matching engine
- DM template selection
- Media attachment handling

### Admin Panel
- User authentication
- CRUD operations for:
  - Trigger keywords
  - DM templates
- Activity dashboard
- System health monitoring

## Constraints
- Must run in Docker environment
- Instagram API rate limits
- 2FA requirements for admin access
- Local development focus initially