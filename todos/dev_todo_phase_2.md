# Development Tasks: Phase 2 - Core Functionality Implementation

## 1. Implement Admin Authentication
- [ ] **Task: Supabase Auth Setup**
**Modify [`admin/admin/src/app/layout.tsx`](admin/admin/src/app/layout.tsx)**:
```tsx
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <SupabaseProvider supabaseClient={supabase}>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
```
**Create [`admin/admin/src/types/supabase.ts`](admin/admin/src/types/supabase.ts)**:
```ts
import { Database } from '@/lib/database.types'

export type { Database }
```
**Verification:** Confirm auth provider is initialized without errors.

## 2. Create Trigger Management UI
- [ ] **Task: Triggers List Page**
**Create [`admin/admin/src/app/triggers/page.tsx`](admin/admin/src/app/triggers/page.tsx)**:
```tsx
import { prisma } from '@/lib/prisma'

export default async function TriggersPage() {
  const triggers = await prisma.triggers.findMany()
  
  return (
    <div>
      <h1>Triggers</h1>
      <ul>
        {triggers.map(trigger => (
          <li key={trigger.id}>
            {trigger.keyword} - {trigger.post_id}
          </li>
        ))}
      </ul>
    </div>
  )
}
```
**Verification:** Visit `/triggers` and confirm list displays.

## 3. Implement Bot Service Core
- [ ] **Task: Instagram Bot Setup**
**Modify [`bot/main.py`](bot/main.py)**:
```python
from instagram_private_api import Client

api = Client(
  os.getenv("INSTAGRAM_USER"), 
  os.getenv("INSTAGRAM_PASSWORD")
)

def handle_comment(comment):
  print(f"New comment: {comment['text']}")

# Basic comment polling
last_timestamp = None
while True:
  activity = api.get_recent_activity()
  new_comments = [item for item in activity if item['type'] == 'comment']
  
  if last_timestamp:
    new_comments = [c for c in new_comments if c['timestamp'] > last_timestamp]
  
  for comment in new_comments:
    handle_comment(comment)
  
  if new_comments:
    last_timestamp = new_comments[0]['timestamp']
  
  time.sleep(60)
```
**Verification:** Run bot and confirm it logs comments.