import Fastify from "fastify";
import createError from "@fastify/error";
import { Type } from "@sinclair/typebox";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const server = Fastify({
  logger: {
    level: "info",
  },
});

server.post("/", async (request, reply) => {
  server.log.info(`request.validationError ${request.validationError}`);

  if (request.validationError) {
    return reply.status(500).send({
      statusCode: 500,
      error: "MY_ERROR",
      message: "From route",
    });
  }

  return {
    id: 1,
    fullName: `${request.body.userName}`,
  };
});

server.listen({ port: 8080, host: "::1" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
