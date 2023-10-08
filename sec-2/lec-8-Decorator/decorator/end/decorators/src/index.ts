import Fastify from "fastify";
import decorators from "./decorators";

const server = Fastify({
  logger: {
    level: "info",
  },
});

server.register(decorators);

server.listen({ port: 8080, host: "::1" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
