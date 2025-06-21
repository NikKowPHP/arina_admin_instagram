# ROO-AUDIT-TAG :: plan-008-docker-setup.md :: Implement admin panel Docker setup
# Use the official Node.js 18 image with Alpine
FROM node:18-alpine AS builder

# Install system dependencies for native modules
RUN apk add --no-cache python3 make g++

# Create and set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma/schema.prisma ./prisma/

# Install dependencies
RUN npm install --legacy-peer-deps --include=dev

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built assets and production dependencies
# Set environment variables
ENV DATABASE_URL=postgres://postgres:password@db:5433/postgres
ENV NODE_ENV=production

# Copy built assets and production dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Regenerate Prisma client for production environment
RUN npx prisma generate

# Expose the port
EXPOSE 3000

# Health check and startup
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl --fail http://localhost:3000/api/bot/health || exit 1

# Start the application with environment validation
CMD ["sh", "-c", "./entrypoint.sh && npm start"]
# ROO-AUDIT-TAG :: plan-008-docker-setup.md :: END