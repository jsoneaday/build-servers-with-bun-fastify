import { PrismaClient } from "@prisma/client";
import { SortOrder } from "../Repository";

export default class MessageRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async selectMessagesOfFollowed(followerId: bigint) {
    return (
      await this.prisma.follow.findMany({
        select: {
          followed: {
            select: {
              messages: true,
            },
          },
        },
        where: {
          followerId,
        },
      })
    )
      .flatMap((follow) => follow.followed.messages)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async selectMessagesByAuthorId(authorId: bigint) {
    return await this.prisma.message.findMany({
      where: {
        authorId,
      },
      orderBy: {
        updatedAt: SortOrder.Desc,
      },
    });
  }

  async selectMessageResponses(respondedMsgId: bigint) {
    return (
      await this.prisma.messageResponse.findMany({
        select: {
          responderMsg: true,
          respondedMsg: true,
        },
        where: {
          respondedMsgId,
        },
      })
    )
      .flatMap((response) => ({
        responder: response.responderMsg,
        responded: response.respondedMsg,
      }))
      .sort(
        (
          { responder: responder_a, responded: responded_a },
          { responder: responder_b, responded: responded_b }
        ) => responder_b.updatedAt.getTime() - responder_a.updatedAt.getTime()
      );
  }

  async selectMessageBroadcasts(broadcastMsgId: bigint) {
    return (
      await this.prisma.messageBroadcast.findMany({
        select: {
          broadcasterMsg: true,
          broadcastMsg: true,
          additionalMessage: true,
        },
        where: {
          broadcastMsgId,
        },
      })
    )
      .flatMap((response) => ({
        broadcaster: {
          ...response.broadcasterMsg,
          additionalMessage: response.additionalMessage,
        },
        broadcast: response.broadcastMsg,
      }))
      .sort(
        (
          { broadcaster: responder_a, broadcast: broadcast_a },
          { broadcaster: responder_b, broadcast: broadcast_b }
        ) => responder_b.updatedAt.getTime() - responder_a.updatedAt.getTime()
      );
  }

  async insertMessage(
    authorId: bigint,
    body: string,
    image?: Buffer,
    respondedMsgId?: bigint,
    broadcastMsgId?: bigint,
    additionalMessage?: string
  ) {
    if (respondedMsgId && broadcastMsgId) {
      throw new Error("Cannot respond and broadcast at the same time");
    }
    if (!broadcastMsgId && additionalMessage) {
      throw new Error("Cannot add additional message without broadcast");
    }

    return await this.prisma.$transaction(async (tx) => {
      const newMessage = await tx.message.create({
        data: {
          authorId,
          body,
          image,
        },
      });

      if (respondedMsgId) {
        await tx.messageResponse.create({
          data: {
            responderMsgId: newMessage.id,
            respondedMsgId,
          },
        });
      } else if (broadcastMsgId) {
        await tx.messageBroadcast.create({
          data: {
            broadcasterMsgId: newMessage.id,
            broadcastMsgId,
            additionalMessage,
          },
        });
      }

      return newMessage;
    });
  }
}
