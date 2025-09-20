FROM oven/bun:1 as base

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install --frozen-lockfile --production

COPY . .

EXPOSE 3000

CMD bunx prisma migrate deploy && bun src/index.ts
