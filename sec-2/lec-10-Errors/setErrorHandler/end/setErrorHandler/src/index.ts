import Fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import setErrorPlugin from "./set-error-plugin";

const server = Fastify({
  logger: true,
});

server.setErrorHandler((err, req, rep) => {
  rep.status(500).send("error from root");
});

server.register(setErrorPlugin);

server.listen({ port: 8080, host: "::1" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
