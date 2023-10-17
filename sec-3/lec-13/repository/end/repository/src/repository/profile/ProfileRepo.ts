import Repository, { SortOrder } from "../Repository";

export default class ProfileRepo {
  private _repo: Repository;

  constructor(repo: Repository) {
    this._repo = repo;
  }

  async selectProfile(userName: string) {
    return await this._repo.prisma.profile.findUnique({
      where: {
        userName,
      },
    });
  }

  /// Select the profiles that this user is followed
  async selectFollowedProfiles(followerId: bigint) {
    return await this._repo.prisma.follow.findMany({
      select: {
        followed: true,
      },
      where: {
        followerId,
      },
      orderBy: {
        updatedAt: SortOrder.Desc,
      },
    });
  }

  /// select profiles that are followers of this user
  async selectFollowerProfiles(followedId: bigint) {
    return await this._repo.prisma.follow.findMany({
      select: {
        follower: true,
      },
      where: {
        followedId,
      },
      orderBy: {
        updatedAt: SortOrder.Desc,
      },
    });
  }

  async insertProfile(
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

  async insertFollow(followerId: bigint, followedId: bigint) {
    return await this._repo.prisma.follow.create({
      data: {
        followerId,
        followedId,
      },
    });
  }
}
