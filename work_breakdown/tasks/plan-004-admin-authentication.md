# Task: Admin Authentication Implementation (Next.js)

## Overview
Implement secure login for administrators using Supabase Auth.

## Tasks
1. Set up Supabase authentication in Next.js app
2. Create login page with email/password form
3. Implement session management using Supabase cookies
4. Create protected routes for admin panel
5. Add logout functionality
6. Write Cypress tests for authentication flow

## Files to Modify/Create
- `admin/admin/src/app/login/page.tsx` (login UI)
- `admin/admin/src/lib/supabase.ts` (auth configuration)
- `admin/admin/src/middleware.ts` (route protection)
- `admin/admin/cypress/e2e/auth.spec.ts` (Cypress tests)