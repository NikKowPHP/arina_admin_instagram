# Phase 2: Admin Dashboard Functionality - Trigger Management

## 0. Create Button Component (Completed)
- **Implement Component:** Created `src/components/ui/button.tsx`
- **Basic Features:**
  - Variants: primary, secondary, outline
  - Sizes: sm, md, lg
  - Loading state
  - Icon support

## 1. Create Triggers Page
- **Prerequisite:** Button component must exist
- **Implement Route:** Create `src/app/dashboard/triggers/page.tsx`
- **Page Structure:** 
  - Header with title "Trigger Management" and "Create New" button
  - Table showing existing triggers with columns: Keyword, Post ID, Status, Actions
  - Modal for creating/editing triggers

```tsx
// Sample starter code for page.tsx
export default function TriggersPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trigger Management</h1>
        <Button>Create New Trigger</Button>
      </div>
      {/* Trigger list table */}
    </div>
  )
}
```

## 2. Implement CRUD Operations
- **Create Server Actions:** Add to `src/lib/actions.ts`
```ts
// Create trigger
export async function createTrigger(formData: FormData) {
  // Validate input
  // Insert into database
}

// Update trigger 
export async function updateTrigger(id: string, formData: FormData) {
  // Validate input
  // Update database
}

// Delete trigger
export async function deleteTrigger(id: string) {
  // Delete from database
}
```

## 3. Build Trigger Form Component
- **Create:** `src/components/trigger-form.tsx`
- **Fields:**
  - Keyword (required)
  - Post ID (required)
  - Status toggle (active/inactive)
  - Template selection dropdown

## 4. Add Navigation Link
- **Update:** `src/components/sidebar.tsx`
```tsx
<Link href="/dashboard/triggers" className="flex items-center gap-2">
  <IconTrigger />
  Triggers
</Link>
```

## 5. Validation
- **Add Zod schema:** `src/lib/validators.ts`
```ts
export const triggerSchema = z.object({
  keyword: z.string().min(2),
  postId: z.string().min(1),
  isActive: z.boolean(),
  templateId: z.string().uuid()
});
```

## Verification
- **Test Cases:**
  - Can create new triggers through UI
  - Existing triggers display in table
  - Edit form pre-populates correctly
  - Deletion works with confirmation
  - Validation errors show properly