#!/bin/sh
set -e

# Check required environment variables
for var in INSTAGRAM_USERNAME INSTAGRAM_PASSWORD DATABASE_URL
do
  if [ -z "${!var}" ]; then
    echo "Error: $var is not set"
    exit 1
  fi
done

echo "All required environment variables are set"