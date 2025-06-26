#!/bin/sh
set -e

# Check required environment variables
if [ -z "${INSTAGRAM_USERNAME}" ]; then
  echo "Error: INSTAGRAM_USERNAME is not set"
  exit 1
fi

if [ -z "${INSTAGRAM_PASSWORD}" ]; then
  echo "Error: INSTAGRAM_PASSWORD is not set"
  exit 1
fi

if [ -z "${DATABASE_URL}" ]; then
  echo "Error: DATABASE_URL is not set"
  exit 1
fi

echo "All required environment variables are set"