# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy Prisma + source and build
COPY prisma.config.ts ./
COPY prisma ./prisma
COPY tsconfig*.json ./
COPY src ./src

ARG DATABASE_URL="file:./dev.db"
ENV DATABASE_URL=$DATABASE_URL

# Generate Prisma client + build Nest
RUN npx prisma generate
RUN npm run build

# ---- runtime ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy runtime artifacts
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma.config.ts ./prisma.config.ts 
COPY package*.json ./
COPY docker-entrypoint.sh ./docker-entrypoint.sh

EXPOSE 4000
ENTRYPOINT ["./docker-entrypoint.sh"]
