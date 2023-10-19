import { FastifyPluginAsync } from "fastify";

const profile: FastifyPluginAsync = async function (fastify) {
  fastify.get("/profiles", async (request, reply) => {
    return { hello: "profisdfles" };
  });
};
export default profile;

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
