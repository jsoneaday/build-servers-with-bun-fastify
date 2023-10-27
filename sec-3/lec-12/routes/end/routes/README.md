Build Servers with Bun and Fastify
By David Choi

# setup

1. deploy docker
   run sh deploy.sh
2. deploy schema to db
   run bunx prisma migrate deploy
3. deploy test data
   run psql -h localhost -p 5434 -d fastserver -U fastserver -a -f testdata.sql
