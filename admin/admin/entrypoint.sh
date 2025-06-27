#!/bin/sh
set -e

# Check required environment variables
for var in DATABASE_URL SUPABASE_URL SUPABASE_KEY
do
  if [ -z "${!var}" ]; then
    echo "Error: $var is not set"
    exit 1
  fi
done

echo "All required environment variables are set"