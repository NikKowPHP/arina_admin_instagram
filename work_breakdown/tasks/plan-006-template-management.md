# Task: Template Management Implementation (Next.js)

## Overview
Implement full CRUD for DM response templates with media support.

## Tasks
1. Create UI for listing templates
2. Implement create template form with text/URL fields
3. Add edit template functionality
4. Implement delete template with confirmation
5. Add media preview for template URLs
6. Connect UI to backend API routes
7. Write Cypress tests for CRUD operations

## Files to Modify/Create
- `admin/admin/src/app/dashboard/templates/page.tsx` (template list UI)
- `admin/admin/src/components/create-template-form.tsx` (create form)
- `admin/admin/src/components/edit-template-form.tsx` (edit form)
- `admin/admin/src/app/api/templates/[[...slug]]/route.ts` (API routes)
- `admin/admin/cypress/e2e/template_crud.spec.ts` (Cypress tests)