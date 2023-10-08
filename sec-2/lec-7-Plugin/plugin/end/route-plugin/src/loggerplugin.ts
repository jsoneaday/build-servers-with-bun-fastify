import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.log.info({ user: "testing logger object" });
  fastify.get("/log", async (req, rep) => {
    req.log.info({ user: "testing logger object" });
    return;
  });
}
