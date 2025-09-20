# -------------------------
# Stage 1: Builder
# -------------------------
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy only dependency files first to leverage caching
COPY package.json bun.lockb* ./

# Install all dependencies (dev + prod) for building
RUN bun install --frozen-lockfile

# Copy all source code
COPY . .

# -------------------------
# Stage 2: Production
# -------------------------
FROM oven/bun:1 AS prod

WORKDIR /app

# Copy only what we need from builder
COPY --from=builder /app /app

# Install only production dependencies
RUN bun install --production --frozen-lockfile

# Expose port
EXPOSE 3000

# Copy entrypoint script
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Start container
CMD ["./entrypoint.sh"]
