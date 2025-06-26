# ROO-AUDIT-TAG :: plan-008-docker-setup.md :: Implement admin panel Docker setup
# Use the official Node.js 18 image with Alpine
FROM node:18-alpine AS builder

# Set build arguments for Supabase environment variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_KEY

# Set environment variables for the build process
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_KEY=$NEXT_PUBLIC_SUPABASE_KEY

# Install system dependencies for native modules
RUN apk add --no-cache python3 make g++

# Create and set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma/schema.prisma ./prisma/

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm ci --legacy-peer-deps

# Generate Prisma client
RUN npx prisma generate

# Start the application in development mode
CMD ["npm", "run", "dev"]
# ROO-AUDIT-TAG :: plan-008-docker-setup.md :: END
