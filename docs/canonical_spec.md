# Canonical Specification: Instagram Comment-to-DM Bot System

## 1. Project Vision & Business Requirements
Create an automated system for Instagram engagement where users commenting with specific keywords on posts receive automated DMs. The system must include a secure admin panel for managing triggers and DM content. The entire system must run locally via Docker for easy development and testing. The key business objective is to increase user engagement and simplify campaign management for marketing admins.

## 2. Functional Requirements

### Instagram Bot Service (Python)
- **Comment Monitoring:** Continuously polls the Instagram API for new comments on posts configured by an admin.
- **Keyword Matching:** Matches comment text against a list of active trigger keywords. Supports exact and partial matches, case-insensitive.
- **DM Response:** Sends a pre-configured DM (text and optional media) to the user who commented. Implements rate-limiting to avoid spam.

### Admin Panel (Next.js)
- **Authentication:** Secure login for administrators via Supabase Auth.
- **Trigger Management:** Full CRUD (Create, Read, Update, Delete) for trigger keywords, including the ability to link them to posts and templates, and toggle their active status.
- **Template Management:** Full CRUD for DM response templates, including text content and optional media URLs.
- **Dashboard:** Provides real-time analytics on trigger usage, DMs sent, and overall system health.

## 3. Technical Design & Architecture
The system follows a layered architecture:
- **Presentation:** Next.js Admin Panel
- **Application:** Next.js API Routes
- **Domain:** Python Bot Service & AI Logic
- **Data:** Supabase (PostgreSQL via Prisma) & Supabase Storage

```text
[Instagram Users] <-> [Instagram API] <-> [Python Bot Service]
                             ^
                             |
                             v
[Admin Users] <-> [Next.js Admin Panel] <-> [Supabase Database]