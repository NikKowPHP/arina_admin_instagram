#!/bin/bash

# ROO-AUDIT-TAG :: plan-012-audit-script.md :: Create audit verification script

echo "Running system audit..."

# Check for placeholder comments
echo "Checking for placeholder comments:"
grep -rnw . -e 'TODO\|FIXME\|\[IMPLEMENT\]' --exclude-dir={node_modules,__pycache__,.git,venv,instagram_bot/venv,admin/admin/.next} --exclude={work_breakdown/tasks/audit_failures.md,docs/testing_environment.md,admin/admin/src/generated/prisma/runtime/library.d.ts}

# ROO-AUDIT-TAG :: plan-003-database-verification.md :: Database schema validation
# Verify database schema
echo -e "\nVerifying database schema:"
# TODO: Replace with actual DATABASE_URL or ensure it's set in the environment
DATABASE_URL="postgresql://user:password@host:port/database" npx prisma validate --schema ./admin/admin/prisma/schema.prisma
# ROO-AUDIT-TAG :: plan-003-database-verification.md :: END

# Check audit plan exists
echo -e "\nChecking audit plan:"
if [ -f "work_breakdown/master_plan.md" ]; then
  echo "Audit plan exists"
else
  echo "Missing audit plan"
  exit 1
fi

echo "Audit completed"
# ROO-AUDIT-TAG :: plan-012-audit-script.md :: END