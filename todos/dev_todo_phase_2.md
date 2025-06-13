# Development Tasks: Phase 2 - Core Functionality Implementation

## 1. Implement Admin Authentication
- [x] **Task: Supabase Auth Setup**

## 2. Create Trigger Management UI
- [ ] **Task: Triggers List Page**
  **Create [`admin/admin/src/app/triggers/page.tsx`](admin/admin/src/app/triggers/page.tsx)**:
  ```tsx
  import { DataTable } from '@/components/ui/data-table'
  import { columns } from './columns'
  import { getTriggers } from '@/lib/actions'

  export default async function TriggersPage() {
    const triggers = await getTriggers()
    
    return (
      <div className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Triggers</h1>
          <NewTriggerButton />
        </div>
        <DataTable columns={columns} data={triggers} />
      </div>
    )
  }
  ```

  **Create [`admin/admin/src/app/triggers/columns.tsx`](admin/admin/src/app/triggers/columns.tsx)**:
  ```tsx
  import { ColumnDef } from '@tanstack/react-table'
  import { Trigger } from '@/types/supabase'

  export const columns: ColumnDef<Trigger>[] = [
    {
      accessorKey: 'keyword',
      header: 'Keyword',
    },
    {
      accessorKey: 'post_id',
      header: 'Post ID',
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => row.original.is_active ? 'Active' : 'Inactive'
    },
    {
      id: 'actions',
      cell: ({ row }) => <RowActions trigger={row.original} />
    }
  ]
  ```

  **Create [`admin/admin/src/lib/actions.ts`](admin/admin/src/lib/actions.ts)**:
  ```ts
  import { createClient } from '@/lib/supabase'
  
  export async function getTriggers() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('triggers')
      .select('*')
    
    if (error) throw error
    return data
  }
  ```

  **Create [`admin/admin/src/app/triggers/new-button.tsx`](admin/admin/src/app/triggers/new-button.tsx)**:
  ```tsx
  'use client'
  
  import { Button } from '@/components/ui/button'
  import { useRouter } from 'next/navigation'

  export function NewTriggerButton() {
    const router = useRouter()
    
    return (
      <Button onClick={() => router.push('/triggers/new')}>
        New Trigger
      </Button>
    )
  }
  ```

  **Verification:** 
  - Page loads without errors
  - Displays triggers from database
  - New button opens empty form
  - Row actions work

- [ ] **Task: Trigger API Routes**
  **Create [`admin/admin/src/app/api/triggers/route.ts`](admin/admin/src/app/api/triggers/route.ts)**:
  ```ts
  import { createClient } from '@/lib/supabase'
  import { NextResponse } from 'next/server'

  export async function GET() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('triggers')
      .select('*')
    
    if (error) return NextResponse.error()
    return NextResponse.json(data)
  }

  export async function POST(request: Request) {
    const supabase = createClient()
    const trigger = await request.json()
    
    const { data, error } = await supabase
      .from('triggers')
      .insert(trigger)
      .select()
    
    if (error) return NextResponse.error()
    return NextResponse.json(data)
  }
  ```

  **Verification:**
  - API returns proper status codes
  - CRUD operations work via Postman
  - Integrates with UI components

## 3. Create Template Management UI
- [ ] **Task: Templates List Page**