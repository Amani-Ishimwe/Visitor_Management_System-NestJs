# ---------- Base Stage ----------
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy all project files
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# ---------- Build Stage ----------
FROM base AS build

# Build the NestJS app
RUN pnpm run build

# ---------- Production Stage ----------
FROM node:18-alpine AS production

# Install pnpm
RUN npm install -g pnpm

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nestjs -u 1001

WORKDIR /app

# Copy package files and install only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy Prisma schema before generating client
COPY --from=build /app/prisma ./prisma

# Generate Prisma client in production
RUN npx prisma generate

# Copy built NestJS app and templates
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/src/email/templates ./dist/email/templates

# Use non-root user
USER nestjs

# Expose app port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the app
CMD ["node", "dist/main"]
