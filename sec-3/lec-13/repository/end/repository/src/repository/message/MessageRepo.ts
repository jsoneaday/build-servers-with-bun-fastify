import Repository, { SortOrder } from "../Repository";

export default class MessageRepo {
  constructor(private readonly repo: Repository) {}

  async selectMessagesOfFollowed(followerId: bigint) {
    return (
      await this.repo.prisma.follow.findMany({
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
    return await this.repo.prisma.message.findMany({
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
      await this.repo.prisma.messageResponse.findMany({
        select: {
          responderMsg: true,
        },
        where: {
          respondedMsgId,
        },
      })
    )
      .flatMap((response) => response.responderMsg)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
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

    return await this.repo.prisma.$transaction(async (tx) => {
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
          },
        });
      }

      return newMessage;
    });
  }
}
