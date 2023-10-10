import { FastifyInstance, FastifyPluginAsync } from "fastify";

export type MyVal = { myval: string };

const typedplugin: FastifyPluginAsync<MyVal> = async function (
  fastify: FastifyInstance,
  options: MyVal
) {
  fastify.get("/b", async (req, rep) => {
    fastify.log.info("inside typedplugin route handler");
    return `hello world b ${options.myval}`;
  });
};

export default typedplugin;
