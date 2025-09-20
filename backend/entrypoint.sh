#!/bin/sh
# Run database migrations
bunx prisma migrate deploy

# Start the app
bun src/index.ts
