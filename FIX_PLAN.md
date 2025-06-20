# Fix Plan for Docker Build Failures

## Objective
Resolve Docker build failures by fixing environment variable handling and dependency initialization.

## Steps

1. **Fix Prisma initialization in WebSocket route**
   - Implement singleton pattern for Prisma client
   - Update `admin/admin/src/app/api/ws/dashboard/route.ts` to use shared Prisma instance

2. **Add environment variable checks in API routes**
   - Add validation for Supabase environment variables in `admin/admin/src/app/api/templates/[[...slug]]/route.ts`
   - Throw meaningful errors if variables are missing

3. **Update Dockerfile environment setup**
   - Add all required environment variables to Dockerfile
   - Include build-time arguments for Supabase credentials

4. **Verify Docker build**
   - Test Docker build after implementing fixes
   - Ensure all routes initialize dependencies properly

## Implementation Details

### 1. Prisma Initialization Fix
```typescript
// Shared Prisma client (lib/prisma.ts)
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()
export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
```

### 2. Supabase Validation
```typescript
// In templates route
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase environment variables not configured');
}
```

### 3. Dockerfile Updates
```dockerfile
# Add to builder stage
ARG NEXT_PUBLIC_SUPABASE_URL
ARG SUPABASE_SERVICE_ROLE_KEY

# Add to production stage
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY