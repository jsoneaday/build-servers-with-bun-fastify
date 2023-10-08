import { FastifyInstance, FastifyPluginAsync } from "fastify";

const decorators: FastifyPluginAsync = async function (
  fastify: FastifyInstance
) {
  fastify.decorateRequest("reqvar", 33);
  fastify.decorateReply("repvar", () => "returned from repvar");

  fastify.get("/", async (request, reply) => {
    return `reqvar: ${request.reqvar}, repvar: ${reply.repvar()}`;
  });
};

export default decorators;
