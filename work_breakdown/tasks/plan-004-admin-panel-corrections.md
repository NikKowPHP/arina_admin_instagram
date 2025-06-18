# Development Plan for Ticket 11-13: Admin Panel Corrections

## Objective
Address missing features in the admin panel identified during audit.

## Tasks

### Ticket 11: Add Template Media Support (COMPLETED)
- [x] **(LOGIC)** Update template schema in [`admin/admin/src/app/api/templates/[[...slug]]/route.ts`](admin/admin/src/app/api/templates/[[...slug]]/route.ts) to include `media_url`
- [x] **(LOGIC)** Modify CRUD operations to handle media URLs
- [x] **(UI)** Add media URL field to template form in [`admin/admin/src/app/dashboard/templates/page.tsx`](admin/admin/src/app/dashboard/templates/page.tsx)
- [x] **(UI)** Implement media preview component

### Ticket 12: Enhance Dashboard Metrics (COMPLETED)
- [x] **(LOGIC)** Add DMs sent tracking to analytics queries
- [x] **(LOGIC)** Implement system health monitoring endpoints
- [x] **(UI)** Update dashboard charts in [`admin/admin/src/app/dashboard/page.tsx`](admin/admin/src/app/dashboard/page.tsx)
- [x] **(UI)** Add new metrics displays and health indicators

### Ticket 13: Implement Real-time Updates (COMPLETED)
- [x] **(LOGIC)** Set up WebSocket server or SSE endpoint
- [x] **(LOGIC)** Modify data fetching to support real-time updates
- [x] **(UI)** Update chart components in [`admin/admin/src/app/dashboard/page.tsx`](admin/admin/src/app/dashboard/page.tsx) for live data
- [x] **(UI)** Add auto-refresh functionality to relevant components

## Dependencies
- Updated bot service metrics collection
- WebSocket/SSE server setup
- Database schema consistency

## Notes
- Maintain existing dashboard functionality during updates
- Ensure real-time updates are performant
- Update documentation for new features