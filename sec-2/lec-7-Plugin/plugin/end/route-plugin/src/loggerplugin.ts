import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  // does not work, requires logging from request
  fastify.log.info({ user: "from instance" });

  fastify.get("/log", async (req, rep) => {
    req.log.info({ user: "from req user" });

    return;
  });
}
