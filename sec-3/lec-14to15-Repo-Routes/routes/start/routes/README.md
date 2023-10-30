Build Servers with Bun and Fastify
By David Choi

# setup

1. Create migration (if needed)
   bunx prisma migrate dev --name init
2. deploy docker by running
   sh deploy.sh
3. deploy test data by running
   psql -h localhost -p 5432 -d fastserver -U fastserver -a -f testdata.sql
