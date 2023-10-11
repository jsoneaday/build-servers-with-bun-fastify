import Fastify from "fastify";
import schemaPlugin from "./schema-errors";

const server = Fastify({
  logger: true,
});

server.register(schemaPlugin);

server.listen({ port: 8080, host: "::1" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
