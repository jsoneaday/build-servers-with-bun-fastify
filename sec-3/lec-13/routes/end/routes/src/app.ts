import Fastify, { FastifyInstance } from "fastify";

export default function app(
  setup: (fastify: FastifyInstance) => void,
  opts = { logger: true }
) {
  const server = Fastify(opts);

  setup(server);

  return server;
}
