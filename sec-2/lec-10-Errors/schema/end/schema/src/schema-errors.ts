import { FastifyInstance } from "fastify";
import createError from "@fastify/error";
import { Type } from "@sinclair/typebox";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const MyError = createError("MY_ERROR_TYPE", "My Error:");

export default async function schemaPlugin(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
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
      // attachValidation: true,
      schemaErrorFormatter: (err, dataVar) => {
        return new MyError(`An occurred, ${err[0].message}, ${dataVar}`);
      },
      errorHandler: (err, req, rep) => {
        return rep.status(500).send({
          statusCode: 500,
          error: "MY_ERROR1",
          message: "error from errorHandler",
        });
      },
    },
    async (req, rep) => {
      // enable attachValidation to allow this code to run
      if (req.validationError) {
        return rep.status(500).send({
          statusCode: 500,
          error: "MY_ERROR",
          message: "error from router",
        });
      }

      return {
        id: 11,
        fullName: `Mr. ${req.body.userName}`,
      };
    }
  );
}
