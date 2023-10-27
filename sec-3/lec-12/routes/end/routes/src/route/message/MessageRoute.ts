import { Type, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { Status404Type } from "../ResponseTypes";

const messageRoute: FastifyPluginAsync = async function (
  fastify: FastifyInstance
) {
  const instance = fastify.withTypeProvider<TypeBoxTypeProvider>();

  instance.get(
    "/followedmsgs/:followerId",
    {
      schema: {
        params: Type.Object({
          followerId: Type.String(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.Integer(),
              updatedAt: Type.String(),
              authorId: Type.Integer(),
              body: Type.String(),
              likes: Type.Integer(),
              image: Type.Any(),
            })
          ),
          404: Status404Type,
        },
      },
    },
    async (req, rep) => {
      const { followerId } = req.params;
      const result = await instance.repo.messageRepo.selectMessagesOfFollowed(
        BigInt(followerId)
      );
    }
  );
};

export default messageRoute;
