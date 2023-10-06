import { FastifyPluginAsync } from "fastify";

const profiles: FastifyPluginAsync<any> = async function (fastify, options) {
  fastify.log.info("options passed in:", options);
  fastify.get("/profiles", async (request, reply) => {
    return { hello: "profisdfles" };
  });
};
export default profiles;

const animalBodyJsonSchema = {
  type: "object",
  required: ["animal"],
  properties: {
    animal: { type: "string" },
  },
};

const schema = {
  body: animalBodyJsonSchema,
};

// fastify.post("/animals", { schema }, async (request, reply) => {

// });
