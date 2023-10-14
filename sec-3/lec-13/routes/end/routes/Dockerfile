FROM oven/bun:1.0.6

COPY package.json ./
COPY bun.lockb ./
COPY drizzle ./drizzle
COPY src ./

RUN bun install
CMD bun ./index.ts