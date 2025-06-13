# Phase 1: Core Infrastructure Setup - Development Tasks

## 1. Install Required Dependencies
- **Modify `admin/admin/package.json`**:
  Add the following dependencies to the `dependencies` section:
  ```json
  "chart.js": "^4.4.9",
  "react-chartjs-2": "^5.3.0"
  ```
- **Verification**: Run `npm install` in the `admin/admin` directory and confirm both packages are installed.
- **Status**: Completed

## 2. Fix Data Aggregation Logic
- **Modify `admin/admin/src/lib/actions.ts`**:
  Replace the current `getAnalytics` implementation with proper aggregation:
  ```typescript
  export async function getAnalytics() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString());
    
    if (error) throw error;

    // Aggregate data by date
    const groupedData = data.reduce((acc, entry) => {
      const date = new Date(entry.created_at).toLocaleDateString();
      if (!acc[date]) acc[date] = 0;
      acc[date] += (entry.action === 'trigger' ? 1 : 0);
      return acc;
    }, {});

    // Convert to array format
    const triggerUsage = Object.entries(groupedData).map(([date, count]) => ({
      date,
      count
    }));

    return { triggerUsage };
  }
  ```
- **Verification**: The function should now return aggregated counts per date.

## 3. Generate Correct Supabase Types
- **Execute Command**:
  Run the following command in the terminal:
  ```bash
  npx supabase gen types typescript --project-id your-project-id > admin/admin/src/types/database.ts
  ```
- **Modify `admin/admin/src/lib/supabase.ts`**:
  Update the import to use the new types:
  ```typescript
  import { Database } from '@/types/database';  // Changed from '@/types/supabase'
  ```
- **Verification**: The `Database` type should now come from `database.ts`.

## 4. Add Prisma Scripts
- **Modify `admin/admin/package.json`**:
  Add these scripts to the `scripts` section:
  ```json
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev"
  ```
- **Verification**: Running `npm run prisma:generate` should generate Prisma client.

## 5. Initialize Supabase Database
- **Execute Command**:
  Run database migration:
  ```bash
  docker-compose exec db psql -U postgres -c "CREATE DATABASE arina_admin;"
  npm run prisma:migrate
  ```
- **Verification**: Database tables should match `prisma/schema.prisma`.

## 6. Configure Authentication
- **Modify `admin/admin/src/app/layout.tsx`**:
  Add authentication check to redirect unauthenticated users:
  ```tsx
  import { redirect } from 'next/navigation';
  import { createClient } from '@/lib/supabase';
  
  export default async function RootLayout({ children }) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      redirect('/login');
    }
    
    return (
      // ... existing layout code
    );
  }
  ```
- **Verification**: Unauthenticated users should be redirected to login.

## 7. Update README with Setup Instructions
- **Modify `README.md`**:
  Add environment setup instructions:
  ```markdown
  ## Environment Setup
  
  1. Create `.env.local` in `admin/admin` with:
     ```
     DATABASE_URL="postgres://postgres:password@localhost:5432/arina_admin"
     NEXT_PUBLIC_SUPABASE_URL="http://localhost:5432"
     NEXT_PUBLIC_SUPABASE_KEY="your-anon-key"
     ```
  2. Run database setup: `npm run prisma:migrate`
  ```
- **Verification**: README contains complete setup instructions.