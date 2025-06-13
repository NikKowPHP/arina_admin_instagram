# Phase 3: Template Management Implementation

## 1. Create Template Model CRUD Operations ✅
- **Modified `admin/admin/src/lib/actions.ts`**:
  - Added createTemplate, updateTemplate, and deleteTemplate functions
  - Implemented Prisma database operations
  - Included Zod schema validation from validators.ts
- **Created `admin/admin/src/lib/validators.ts`**:
  - Defined templateSchema with content, mediaUrl, and isActive fields

```typescript
// Add to existing actions.ts
export async function createTemplate(formData: FormData) {
  const validated = templateSchema.parse(Object.fromEntries(formData));
  return prisma.template.create({ data: validated });
}

export async function updateTemplate(id: string, formData: FormData) {
  const validated = templateSchema.parse(Object.fromEntries(formData));
  return prisma.template.update({ where: { id }, data: validated });
}

export async function deleteTemplate(id: string) {
  return prisma.template.delete({ where: { id } });
}
```

## 2. Implement Templates Page
- **Create `admin/admin/src/app/dashboard/templates/page.tsx`**:
  - Table view of all templates
  - "Create New" button that opens template form modal
  - Action column with edit/delete buttons

```tsx
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function TemplatesPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Template Management</h1>
        <Button variant="primary">
          <Plus className="mr-2 h-4 w-4" />
          Create New Template
        </Button>
      </div>
      {/* Template list table */}
    </div>
  );
}
```

## 3. Create Template Form Component
- **Create `admin/admin/src/components/template-form.tsx`**:
  - Form fields: content (textarea), mediaUrl (file upload), and status toggle
  - Reuse existing form patterns from trigger management
  - Add markdown support for content field

```tsx
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function TemplateForm({ template }) {
  return (
    <form>
      <Textarea 
        name="content"
        placeholder="Template content"
        defaultValue={template?.content}
      />
      {/* Add media upload and other fields */}
      <Button type="submit">Save Template</Button>
    </form>
  );
}
```

## 4. Add Template Routes to Sidebar
- **Update `admin/admin/src/components/sidebar.tsx`**:
  - Add navigation link to templates page
  - Use consistent styling with other navigation items

```tsx
<Link href="/dashboard/templates" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
  <FileTextIcon className="w-5 h-5" />
  <span>Templates</span>
</Link>
```

## 5. Implement Validation Schema
- **Create `admin/admin/src/lib/validators.ts`**:
  - Add Zod schema for template validation
  - Ensure content has minimum length requirement

```typescript
import { z } from 'zod';

export const templateSchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters"),
  mediaUrl: z.string().url().optional(),
  isActive: z.boolean().default(true)
});
```

## 6. Update API Documentation
- **Modify `documentation/api_spec.md`**:
  - Add template management endpoints to API documentation
  - Include request/response examples

```markdown
### Template Management
`POST /api/templates`
```json
{
  "content": "Congratulations! You won!",
  "media_url": "https://example.com/prize.jpg"
}
```

## Verification Steps
1. Create new template through UI
2. Verify template appears in database
3. Test edit/delete functionality
4. Confirm validation errors show properly
5. Check API documentation is updated