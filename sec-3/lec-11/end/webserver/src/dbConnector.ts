import fastifyPlugin from "fastify-plugin";
import fastifyMongodb from "@fastify/mongodb";

async function dbConnector(fastify, options) {
  fastify.register(fastifyMongodb, {
    url: "mongodb://localhost:27017/test_database",
  });
}

export default fastifyPlugin(dbConnector);
