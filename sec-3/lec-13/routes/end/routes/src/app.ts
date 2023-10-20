import Fastify, { FastifyInstance } from "fastify";

export default function app(
  setup: (fastify: FastifyInstance) => void,
  opts = {}
) {
  const server = Fastify(opts);

  setup(server);

  return server;
}
