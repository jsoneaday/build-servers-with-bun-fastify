import { FastifyInstance } from "fastify";

export default async function setErrorPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((err, req, rep) => {
    rep.status(501).send("error from plugin");
  });

  fastify.get(
    "/",
    {
      errorHandler: (err, req, rep) => {
        rep.status(502).send("error from route /");
      },
    },
    async (req, rep) => {
      throw new Error("An error has occurred");
    }
  );
}
