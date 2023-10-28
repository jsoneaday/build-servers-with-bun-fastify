import { Type, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { Status404Type, Status500, Status404 } from "../ResponseTypes";

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
      try {
        const { followerId } = req.params;
        const result = await instance.repo.messageRepo.selectMessagesOfFollowed(
          BigInt(followerId)
        );

        if (result.length === 0) {
          return rep.status(404).send({
            ...Status404,
            message: "Failed to find followed messages",
          });
        }

        return rep.status(200).send(
          result.map((msg) => {
            return {
              id: Number(msg.id.toString()),
              updatedAt: msg.updatedAt.toISOString(),
              authorId: Number(msg.authorId.toString()),
              body: msg.body,
              likes: msg.likes,
              image: msg.image,
            };
          })
        );
      } catch (e) {
        fastify.log.error("Failed to get followed messages", e);
        return rep.status(500).send(Status500);
      }
    }
  );
};

export default messageRoute;
