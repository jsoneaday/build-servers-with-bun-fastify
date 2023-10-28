FROM ubuntu:20.04

RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

RUN apt-get install unzip
RUN npm install -g bun

COPY package.json ./
COPY bun.lockb ./
COPY prisma ./prisma
COPY src ./

RUN bun install --force
RUN bun install -g prisma@5.5.2
CMD bun prisma generate;bun ./index.ts