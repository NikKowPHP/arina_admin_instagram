#!/bin/bash

# ROO-AUDIT-TAG :: plan-012-audit-script.md :: Create audit verification script

echo "Running system audit..."

# Check for placeholder comments
echo "Checking for placeholder comments:"
grep -rnw . -e 'TODO\|FIXME\|\[IMPLEMENT\]' --exclude-dir={node_modules,__pycache__,.git}

# Verify database schema
echo -e "\nVerifying database schema:"
prisma schema validate

# Check audit plan exists
echo -e "\nChecking audit plan:"
if [ -f "audit/audit_plan.md" ]; then
  echo "Audit plan exists"
else
  echo "Missing audit plan"
  exit 1
fi

echo "Audit completed"
# ROO-AUDIT-TAG :: plan-012-audit-script.md :: END