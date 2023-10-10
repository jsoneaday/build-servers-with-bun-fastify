import { FastifyError, FastifyInstance } from "fastify";

export default function syncplugin(
  fastify: FastifyInstance,
  options: any,
  done: (err?: FastifyError) => void
) {
  fastify.get("/a", async (req, rep) => {
    return "hellow world adfdsf";
  });

  done();
}
