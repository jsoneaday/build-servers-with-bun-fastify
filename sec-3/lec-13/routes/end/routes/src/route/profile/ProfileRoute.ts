import { FastifyPluginAsync } from "fastify";

const profile: FastifyPluginAsync = async function (fastify) {
  fastify.get("/profiles", async (request, reply) => {
    return { hello: "profisdfles" };
  });
};
export default profile;
