import { FastifyInstance, FastifyPluginAsync } from "fastify";

type MyVal = { myval: string };

// add typing and use option
const typedplugin: FastifyPluginAsync<MyVal> = async function (
  fastify: FastifyInstance,
  options: MyVal
) {
  fastify.get("/b", async (request, reply) => {
    fastify.log.info(`myval - ${options.myval}`);
    return "hello world b";
  });
};

export default typedplugin;
