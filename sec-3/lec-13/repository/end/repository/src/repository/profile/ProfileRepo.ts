import { PrismaClient } from "@prisma/client";
import Repository from "../Repository";

export default class ProfileRepo {
  private _repo: Repository;

  constructor(repo: Repository) {
    this._repo = repo;
  }

  async select(userName: string) {
    return await this._repo.prisma.profile.findUnique({
      where: {
        userName,
      },
    });
  }

  /// Select the profiles that this user is following
  async selectFollowingProfiles(followerId: bigint) {
    return await this._repo.prisma.follow.findMany({
      select: {
        following: true,
      },
      where: {
        followerId,
      },
    });
  }

  async insert(
    userName: string,
    fullName: string,
    description: string,
    region?: string,
    mainUrl?: string,
    avatar?: Buffer
  ) {
    return await this._repo.prisma.profile.create({
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
}
