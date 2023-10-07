import Fastify from "fastify";
import createError from "@fastify/error";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";

const server = Fastify({
  logger: {
    level: "info",
  },
}).withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.post<{
  Body: {
    userName: string;
    email: string;
  };
  Reply: {
    id: number;
    fullName: string;
  };
}>(
  "/",
  {
    schema: {
      body: z.object({
        userName: z.string().min(5),
        email: z.string().email(),
      }),
      response: {
        200: z.object({
          id: z.number().min(1),
          fullName: z.string(),
        }),
        500: z.object({
          statusCode: z.number(),
          error: z.string(),
          message: z.string(),
        }),
      },
    },
  },
  async (request, reply) => {
    return {
      id: 1,
      fullName: `${request.body.userName}`,
    };
  }
);

server.listen({ port: 8080, host: "::1" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
