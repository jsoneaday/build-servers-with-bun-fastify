import Fastify from "fastify";
import createError from "@fastify/error";
import { Type } from "@sinclair/typebox";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const server = Fastify({
  logger: {
    level: "info",
  },
}).withTypeProvider<TypeBoxTypeProvider>();

const MyError = createError("MY_ERROR", "MyError:");

server.post(
  "/",
  {
    schema: {
      body: Type.Object({
        userName: Type.String(),
        email: Type.Optional(Type.String({ format: "email" })),
      }),
      response: {
        200: Type.Object({
          id: Type.Integer(),
          fullName: Type.String(),
        }),
        500: Type.Object({
          statusCode: Type.Integer(),
          error: Type.String(),
          message: Type.String(),
        }),
      },
    },
    // enabling attachValidation disrupts normal schema validation flow,
    // ignoring schema validation failures and allowing route body to execute
    attachValidation: true,
    // schemaErrorFormatter: (errors, dataVar) => {
    //   const { instancePath, keyword, message, params, schemaPath } = errors[0];
    //   const errMessage = `Error fields: ${instancePath}, ${keyword}, ${message}, ${schemaPath}`;
    //   server.log.info(errMessage);
    //   return new MyError(errMessage);
    // },
    // errorHandler: (err, req, rep) => {
    //   server.log.info(`Inside errorHandler: ${err}`);

    //   rep.status(500).send({
    //     statusCode: 500,
    //     error: "MY_ERROR",
    //     message: "From errorHandler",
    //   });
    // },
  },
  async (request, reply) => {
    server.log.info(`request.validationError ${request.validationError}`);

    if (request.validationError) {
      return reply.status(500).send({
        statusCode: 500,
        error: "MY_ERROR",
        message: "From route",
      });
    }

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
