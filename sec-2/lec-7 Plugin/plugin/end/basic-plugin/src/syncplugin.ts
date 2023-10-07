import { FastifyError, FastifyInstance } from "fastify";

/// synchronous plugins are possible but require call to done
export default function syncplugin(
  fastify: FastifyInstance,
  options: any,
  done: (err?: FastifyError) => void
) {
  fastify.get("/a", async (request, reply) => {
    return "hello world a";
  });

  done();
}
