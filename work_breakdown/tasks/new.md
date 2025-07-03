### Refactor Plan: Migrate from Supabase DB Client to Prisma ORM

This plan outlines the steps to refactor the application's data access layer from using the Supabase client for database operations to using the Prisma ORM. The primary goal is to centralize and standardize database interactions through Prisma, while retaining Supabase for authentication and storage.

---

- [x] **MODIFY_FILE** `TASK_001`: Add `name` field to the Template model in the Prisma schema
  - **File**: `prisma/schema.prisma`
  - **Dependencies**: `none`
  - **Action**: Add a `name` field to the `Template` model. This field is used by the frontend and API but is missing from the database schema.
    ```prisma
    model Template {
      id        String   @id @default(uuid())
      name      String   // Add this line
      content   String
      mediaUrl  String?  @map("media_url")
      metadata  Json?
      createdAt DateTime @default(now()) @map("created_at")
      triggers  Trigger[]
      
      @@map("templates")
    }
    ```
  - **Reason**: The existing templates UI and API expect a `name` field for each template. This change aligns the database schema with the application's requirements.

- [x] **REFACTOR** `TASK_002`: Create and apply a new database migration for the schema change
  - **File**: `prisma/migrations/` (new directory will be created)
  - **Dependencies**: `[TASK_001]`
  - **Action**: Run the following command in your terminal to create a new migration for the schema change and apply it to the database.
    ```bash
    npx prisma migrate dev --name add_template_name
    ```
  - **Reason**: This task creates a new SQL migration file based on the schema change and applies it to the database, ensuring the `templates` table has the new `name` column.

- [x] **DELETE_FILE** `TASK_003`: Remove obsolete manually-defined database types
  - **File**: `src/types/database.ts`
  - **Dependencies**: `none`
  - **Action**: Delete the file `src/types/database.ts`. Its contents are redundant because Prisma automatically generates more accurate types from the schema.
  - **Reason**: To eliminate outdated and manually maintained types, and rely on the auto-generated types from Prisma for type safety.

- [x] **MODIFY_FILE** `TASK_004`: Update Triggers page to use Prisma-generated types
  - **File**: `src/app/dashboard/triggers/page.tsx`
  - **Dependencies**: `[TASK_003]`
  - **Action**: Change the import for the `Trigger` type. Replace `import { Trigger } from '@/types/database';` with `import { Trigger } from '@prisma/client';`.
  - **Reason**: To use the official, auto-generated types from Prisma, ensuring the component is correctly typed according to the database schema.

- [x] **DELETE_FILE** `TASK_005`: Remove redundant Prisma type helper file
  - **File**: `src/types/supabase.ts`
  - **Dependencies**: `none`
  - **Action**: Delete the file `src/types/supabase.ts`.
  - **Reason**: This file is a non-standard and unnecessary abstraction. Application code should import types directly from `@prisma/client` for clarity and consistency.

- [x] **MODIFY_FILE** `TASK_006`: Correct Prisma usage in server actions for Triggers
  - **File**: `src/lib/actions.ts`
  - **Dependencies**: `none`
  - **Action**: In the `createTrigger` and `updateTrigger` functions, modify the `data` object passed to Prisma to directly use the foreign key IDs instead of the `connect` syntax.
    - In `createTrigger`, change the `data` object to:
    ```typescript
    data: {
      postId: data.get('postId') as string,
      keyword: data.get('keyword') as string,
      userId: data.get('userId') as string,
      templateId: data.get('templateId') as string,
    },
    ```
    - In `updateTrigger`, change the `data` object to:
    ```typescript
    data: {
      postId: data.get('postId') as string,
      keyword: data.get('keyword') as string,
      userId: data.get('userId') as string,
      templateId: data.get('templateId') as string,
    },
    ```
  - **Reason**: The current implementation uses the `connect` relational syntax, which is incorrect for how the schema is defined. The schema uses scalar fields for foreign keys (`userId`, `templateId`), so these values should be set directly.

- [x] **MODIFY_FILE** `TASK_007`: Refactor template creation/update to use JSON API
  - **File**: `src/app/dashboard/templates/page.tsx`
  - **Dependencies**: `none`
  - **Action**: Modify the `handleCreate` and `handleUpdate` functions to send a JSON payload instead of form data. The API expects JSON.
    - In `handleCreate`, replace the `FormData` logic with:
    ```typescript
    const payload = {
      name: formData.name,
      content: formData.content,
      media_url: mediaUrl || undefined
    };
    await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    ```
    - In `handleUpdate`, replace the `FormData` logic with:
    ```typescript
    const payload = {
      name: formData.name,
      content: formData.content,
      media_url: mediaUrl || undefined
    };
    await fetch(`/api/templates/${currentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    ```
    - Also remove the `createTemplate` and `updateTemplate` helper functions from the top of the file, as the new `fetch` calls replace them.
  - **Reason**: The API endpoint for templates is configured to receive JSON, but the component was attempting to send form data, causing a mismatch. This change aligns the client-side request with the server-side expectation.

- [x] **MODIFY_FILE** `TASK_008`: Refactor templates API route to use Prisma
  - **File**: `src/app/api/templates/[[...slug]]/route.ts`
  - **Dependencies**: `[TASK_001, TASK_002, TASK_007]`
  - **Action**: Replace all Supabase database calls with Prisma Client operations. Standardize the Supabase client usage for auth checks.
    1.  Import the prisma client: `import prisma from '@/lib/prisma';`.
    2.  Remove the `fetchUser` helper function and the unused `v4` import.
    3.  In `GET`, replace `supabase.from(...).select(...)` with `prisma.template.findMany()` or `prisma.template.findUnique()`.
    4.  In `POST`, replace `supabase.from(...).insert(...)` with `prisma.template.create(...)`.
    5.  In `PUT`, fix the undefined `supabase` variable by creating a client instance, and replace `supabase.from(...).update(...)` with `prisma.template.update(...)`.
    6.  In `DELETE`, fix the undefined `supabase` variable and replace `supabase.from(...).delete()` with `prisma.template.delete(...)`.
    7.  Ensure all handlers correctly perform an auth check before executing the Prisma query.
  - **Reason**: To migrate the templates CRUD functionality from Supabase DB to Prisma, centralizing data access and fixing an existing bug with an undefined variable.

- [x] **MODIFY_FILE** `TASK_009`: Refactor triggers API route to use Prisma
  - **File**: `src/app/api/triggers/[[...slug]]/route.ts`
  - **Dependencies**: `none`
  - **Action**: Replace all Supabase database calls in this file with their Prisma Client equivalents, while keeping the existing Supabase authentication logic.
    1.  Import the prisma client: `import prisma from '@/lib/prisma';`.
    2.  Remove the `createClient from '@supabase/supabase-js'` import as it's no longer needed for DB calls.
    3.  In `GET`, replace `supabase.from('triggers').select('*')` with `prisma.trigger.findMany()` or `prisma.trigger.findUnique()`.
    4.  In `POST`, replace `supabase.from('triggers').insert(...)` with `prisma.trigger.create(...)`.
    5.  In `PUT`, replace `supabase.from('triggers').update(...)` with `prisma.trigger.update(...)`.
    6.  In `DELETE`, replace `supabase.from('triggers').delete()` with `prisma.trigger.delete(...)`.
  - **Reason**: This completes the migration of database logic to Prisma by refactoring the final data-access API route.