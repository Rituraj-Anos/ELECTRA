# ═══════════════════════════════════════════════════════════════════
# ELECTRA — Multi-stage Docker build
# Stage 1: Build backend
# Stage 2: Build frontend
# Stage 3: Production runtime
# ═══════════════════════════════════════════════════════════════════

# ─── Stage 1: Backend Build ──────────────────────────────────────
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./
RUN npx tsc

# ─── Stage 2: Frontend Build ────────────────────────────────────
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/app/ ./app/
COPY frontend/components/ ./components/
COPY frontend/lib/ ./lib/
COPY frontend/public/ ./public/
COPY frontend/next.config.ts ./
COPY frontend/tsconfig.json ./
COPY frontend/next-env.d.ts ./
COPY frontend/eslint.config.mjs ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx next build

# ─── Stage 3: Production Runtime ────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Security: run as non-root
RUN addgroup -S electra && adduser -S electra -G electra

# Copy backend
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/backend/package.json ./backend/
COPY backend/src/data ./backend/dist/data

# Copy frontend
COPY --from=frontend-build /app/frontend/.next ./frontend/.next
COPY --from=frontend-build /app/frontend/node_modules ./frontend/node_modules
COPY --from=frontend-build /app/frontend/package.json ./frontend/
COPY --from=frontend-build /app/frontend/public ./frontend/public

# Environment
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080 3000

# Switch to non-root user
USER electra

# Start backend (frontend can be served by Next.js standalone or via reverse proxy)
CMD ["node", "backend/dist/index.js"]
