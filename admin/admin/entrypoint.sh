# file: entrypoint.sh

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

echo "All required environment variables are set."

# Apply database migrations before starting the application
echo "Running database migrations..."
npx prisma migrate deploy
echo "Migrations applied successfully."

# Execute the command passed to the entrypoint (e.g., "npm run dev")
exec "$@"