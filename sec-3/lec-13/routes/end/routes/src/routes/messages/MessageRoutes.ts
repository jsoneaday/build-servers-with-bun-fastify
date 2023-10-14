import { FastifyPluginAsync } from "fastify";

const MessageRoutes: FastifyPluginAsync = async function (fastify) {
  fastify.get("/messages", async (request, reply) => {
    return { hello: "messages" };
  });
};

export default MessageRoutes;
