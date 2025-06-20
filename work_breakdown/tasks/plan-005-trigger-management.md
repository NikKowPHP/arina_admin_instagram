# Task: Trigger Management Implementation (Next.js)

## Overview
Implement full CRUD for trigger keywords with post association.

## Tasks
1. Create UI for listing triggers with search/sort
2. Implement create trigger form with keyword/post/template selection
3. Add edit trigger functionality
4. Implement delete trigger with confirmation
5. Connect UI to backend API routes
6. Write Cypress tests for CRUD operations

## Files to Modify/Create
- `admin/admin/src/app/dashboard/triggers/page.tsx` (trigger list UI)
- `admin/admin/src/components/create-trigger-form.tsx` (create form)
- `admin/admin/src/components/edit-trigger-form.tsx` (edit form)
- `admin/admin/src/app/api/triggers/[[...slug]]/route.ts` (API routes)
- `admin/admin/cypress/e2e/trigger_crud.spec.ts` (Cypress tests)