import { PrismaClient } from "@prisma/client";

export default class ProfileRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async selectProfile(userName: string) {
    return await this.prisma.profile.findUnique({
      where: {
        userName,
      },
    });
  }

  /// Select the profiles that this user has followed
  async selectFollowedProfiles(followerId: bigint) {
    return (
      await this.prisma.follow.findMany({
        select: {
          followed: true,
        },
        where: {
          followerId,
        },
      })
    )
      .flatMap((follow) => follow.followed)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /// select profiles that are followers of this user
  async selectFollowerProfiles(followedId: bigint) {
    return (
      await this.prisma.follow.findMany({
        select: {
          follower: true,
        },
        where: {
          followedId,
        },
      })
    )
      .flatMap((follow) => follow.follower)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async insertProfile(
    userName: string,
    fullName: string,
    description: string,
    region?: string,
    mainUrl?: string,
    avatar?: Buffer
  ) {
    return await this.prisma.profile.create({
      data: {
        userName,
        fullName,
        description,
        region,
        mainUrl,
        avatar,
      },
    });
  }

  async insertFollow(followerId: bigint, followedId: bigint) {
    return await this.prisma.follow.create({
      data: {
        followerId,
        followedId,
      },
    });
  }
}
