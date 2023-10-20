import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";

const profile: FastifyPluginAsync = async function (fastify) {
  const instance = fastify.withTypeProvider<TypeBoxTypeProvider>();

  instance.get(
    "/profile",
    {
      schema: {
        querystring: Type.Object({
          userName: Type.String(),
        }),
        response: {
          200: Type.Object({
            id: Type.BigInt(),
            createdAt: Type.Date(),
            updatedAt: Type.Date(),
            userName: Type.String(),
            fullName: Type.String(),
            description: Type.Optional(Type.String()),
            region: Type.Optional(Type.String()),
            mainUrl: Type.Optional(Type.String()),
            avatar: Type.Optional(Type.Any()),
          }),
          404: Type.Object({
            statusCode: Type.Integer(),
            error: Type.String(),
            message: Type.String(),
          }),
        },
      },
    },
    async (request, reply) => {
      const result = await instance.repo.profileRepo.selectProfile(
        request.query.userName
      );

      if (!result) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Profile not found",
        });
      }

      return {
        id: result.id,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        userName: result.userName,
        fullName: result.fullName,
        description: result.description || undefined,
        region: result.region || undefined,
        mainUrl: result.mainUrl || undefined,
        avatar: result.avatar || undefined,
      };
    }
  );
};
export default profile;
