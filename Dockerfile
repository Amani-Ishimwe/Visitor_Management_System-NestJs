FROM node:18-alpine AS base

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

FROM base AS build

RUN pnpm run build

FROM node:18-alpine AS production

RUN npm install -g pnpm

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app

COPY package.json pnpm-lock.yaml  ./

RUN pnpm install --prod --frozen-lockfile


COPY  --from=build  --chown=nestjs:nodejs /app/dist  ./dist
COPY  --from=build  --chown=nestjs:nodejs /app/generated  ./generated
COPY  --from=build  --chown=nestjs:nodejs /app/prisma  ./prisma


COPY  --from=build --chown=nestjs:nodejs /app/src/email/templates  ./dist/email/templates


USER nestjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \ 
CMD node healthcheck.js

CMD [ "node","dist/main" ]
