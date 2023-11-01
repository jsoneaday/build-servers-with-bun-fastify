import { Type, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import {
  Status404Type,
  Status500,
  Status404,
  Status500Type,
} from "../ResponseTypes";

const messageRoute: FastifyPluginAsync = async function (
  fastify: FastifyInstance
) {
  const instance = fastify.withTypeProvider<TypeBoxTypeProvider>();

  instance.get(
    "/followedmsgs/:followerId",
    {
      schema: {
        params: Type.Object({
          followerId: Type.Integer(),
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
        const result =
          await instance.repo.messageRepo.selectMessagesFromFollowed(
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
        instance.log.error(`Get Followed Messages Error: ${e}`);
        return rep.status(500).send(Status500);
      }
    }
  );

  instance.get(
    "/authormsgs/:authorId",
    {
      schema: {
        params: Type.Object({
          authorId: Type.Integer(),
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
        const { authorId } = req.params;
        const result =
          await instance.repo.messageRepo.selectedMessagesByAuthorId(
            BigInt(authorId)
          );

        if (result.length === 0) {
          return rep.status(404).send({
            ...Status404,
            message: "Failed to find author messages",
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
        instance.log.error(`Get Author Messages Error: ${e}`);
        return rep.status(500).send(Status500);
      }
    }
  );

  instance.get(
    "/responsemsgs/:respondedMsgId",
    {
      schema: {
        params: Type.Object({
          respondedMsgId: Type.Integer(),
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
        const { respondedMsgId } = req.params;
        const result = await instance.repo.messageRepo.selectMessagesResponses(
          BigInt(respondedMsgId)
        );

        if (result.length === 0) {
          return rep.status(404).send({
            ...Status404,
            message: "Failed to find responder messages",
          });
        }

        return rep.status(200).send(
          result.map((msg) => {
            return {
              id: Number(msg.responderMsg.id.toString()),
              updatedAt: msg.responderMsg.updatedAt.toISOString(),
              authorId: Number(msg.responderMsg.authorId.toString()),
              body: msg.responderMsg.body,
              likes: msg.responderMsg.likes,
              image: msg.responderMsg.image,
            };
          })
        );
      } catch (e) {
        instance.log.error(`Get Responder Messages Error: ${e}`);
        return rep.status(500).send(Status500);
      }
    }
  );

  instance.get(
    "/broadcastermsgs/:broadcastMsgId",
    {
      schema: {
        params: Type.Object({
          broadcastMsgId: Type.Integer(),
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
        const { broadcastMsgId } = req.params;
        const result = await instance.repo.messageRepo.selectMessageBroadcasts(
          BigInt(broadcastMsgId)
        );

        if (result.length === 0) {
          return rep.status(404).send({
            ...Status404,
            message: "Failed to find broadcaster messages",
          });
        }

        return rep.status(200).send(
          result.map((msg) => {
            return {
              id: Number(msg.broadcasterMsg.id.toString()),
              updatedAt: msg.broadcasterMsg.updatedAt.toISOString(),
              authorId: Number(msg.broadcasterMsg.authorId.toString()),
              body: msg.broadcasterMsg.body,
              likes: msg.broadcasterMsg.likes,
              image: msg.broadcasterMsg.image,
            };
          })
        );
      } catch (e) {
        instance.log.error(`Get Broadcaster Messages Error: ${e}`);
        return rep.status(500).send(Status500);
      }
    }
  );

  instance.post(
    "/message",
    {
      schema: {
        body: Type.Object({
          authorId: Type.Integer(),
          body: Type.String(),
          image: Type.Optional(Type.Any()),
        }),
        response: {
          200: Type.Object({
            id: Type.Integer(),
          }),
          500: Status500Type,
        },
      },
    },
    async (req, rep) => {
      try {
        const { authorId, body, image } = req.body;
        const result = await instance.repo.messageRepo.insertMessage(
          BigInt(authorId),
          body,
          image
        );

        if (!result) {
          return rep.status(500).send({
            ...Status500,
            message: "Failed to insert message",
          });
        }

        return rep.status(200).send({
          id: Number(result.id),
        });
      } catch (e) {
        instance.log.error(`Create Message Route Error: ${e}`);
        return rep.status(500).send(Status500);
      }
    }
  );
};

export default messageRoute;
