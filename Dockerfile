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

RUN npm install -g pnpm

RUN addgroup -g 1001 -S nodejs \
  && adduser -S nestjs -u 1001

WORKDIR /app

# Install only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# ⬅️ Generate the Prisma client in this final container
RUN npx prisma generate

# Copy compiled files and schema
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=build --chown=nestjs:nodejs /app/src/email/templates ./dist/email/templates

USER nestjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD node healthcheck.js

CMD ["node","dist/main"]