import Fastify, { FastifyReply, FastifyRequest } from "fastify";

const server = Fastify({
  logger: true,
});

server.listen({ port: 8080, host: "::1" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
