import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";

const ProfileRoutes: FastifyPluginAsync = async function (fastify) {
  const fy = fastify.withTypeProvider<TypeBoxTypeProvider>();

  fy.log.info("options passed in:");

  fy.get(
    "/profile/:userName",
    {
      schema: {
        params: Type.Object({
          userName: Type.String(),
        }),
        response: {
          200: Type.Union([
            Type.Object({
              id: Type.BigInt(),
              createdAt: Type.Date(),
              updatedAt: Type.Date(),
              userName: Type.String({ maxLength: 50 }),
              fullName: Type.String({ maxLength: 100 }),
              description: Type.String({ maxLength: 250 }),
              region: Type.Optional(Type.String({ maxLength: 50 })),
              mainUrl: Type.Optional(Type.String({ maxLength: 250 })),
              avatar: Type.Any(),
            }),
            Type.Null(),
          ]),
        },
      },
    },
    async (req, rep) => {
      return null;
    }
  );

  fy.post(
    "/profile",
    {
      schema: {
        body: Type.Object({
          userName: Type.String({ maxLength: 50 }),
          fullName: Type.String({ maxLength: 100 }),
          description: Type.String({ maxLength: 250 }),
          region: Type.Optional(Type.String({ maxLength: 50 })),
          mainUrl: Type.Optional(Type.String({ maxLength: 250 })),
          avatar: Type.Optional(Type.Any()),
        }),
        response: {
          200: Type.Object({
            id: Type.BigInt(),
          }),
        },
      },
    },
    async (req, rep) => {
      return { id: BigInt(0) };
    }
  );
};

export default ProfileRoutes;
