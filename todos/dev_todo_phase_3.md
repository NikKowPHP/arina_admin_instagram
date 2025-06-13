# Phase 3: Admin Dashboard Functionality - Template Management

## 1. Create Templates Page
- **Implement Route:** Create `src/app/dashboard/templates/page.tsx`
- **Page Structure:**
  - Header with title "Template Management" and "Create New" button
  - Table showing existing templates with columns: Name, Content Preview, Actions
  - Modal for creating/editing templates

```tsx
// Sample starter code for page.tsx
export default function TemplatesPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Template Management</h1>
        <Button>Create New Template</Button>
      </div>
      {/* Template list table */}
    </div>
  )
}
```

## 2. Implement CRUD Operations
- **Create Server Actions:** Add to `src/lib/actions.ts`
```ts
// Create template
export async function createTemplate(formData: FormData) {
  // Validate input
  // Insert into database
}

// Update template
export async function updateTemplate(id: string, formData: FormData) {
  // Validate input
  // Update database
}

// Delete template
export async function deleteTemplate(id: string) {
  // Delete from database
}
```

## 3. Build Template Form Component
- **Create:** `src/components/template-form.tsx`
- **Fields:**
  - Name (required)
  - Content textarea with markdown support
  - Status toggle (active/inactive)

## 4. Add Navigation Link
- **Update:** `src/components/sidebar.tsx`
```tsx
<Link href="/dashboard/templates" className="flex items-center gap-2">
  <IconTemplate />
  Templates
</Link>
```

## 5. Validation
- **Add Zod schema:** `src/lib/validators.ts`
```ts
export const templateSchema = z.object({
  name: z.string().min(2),
  content: z.string().min(10),
  isActive: z.boolean()
});
```

## Verification
- **Test Cases:**
  - Can create new templates through UI
  - Existing templates display in table
  - Edit form pre-populates correctly
  - Deletion works with confirmation
  - Validation errors show properly