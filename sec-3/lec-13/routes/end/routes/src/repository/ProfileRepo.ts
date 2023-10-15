import Repository, { DB } from "./Repository";
import { profile, follow } from "../db/schema/Profile";
import { eq, inArray } from "drizzle-orm";
import { SelectResultFields } from "../../node_modules/drizzle-orm/query-builders/select.types";

export default class ProfileRepo {
  constructor(private readonly repo: Repository) {}

  async select(userName: string) {
    return await this.repo.db.query.profile.findFirst({
      where: (profile, { eq }) => eq(profile.userName, userName),
    });
  }

  async selectFollowingProfiles(userName: string) {
    const query = this.repo.db
      .select({
        followingId: follow.followingId,
      })
      .from(follow)
      .innerJoin(profile, eq(follow.followerId, profile.id))
      .where(eq(profile.userName, userName));

    return await this.repo.db
      .select()
      .from(profile)
      .where(inArray(profile.id, query));
  }

  async create(
    userName: string,
    fullName: string,
    description: string,
    region?: string,
    mainUrl?: string,
    avatar?: Buffer
  ) {
    return await this.repo.db
      .insert(profile)
      .values({
        userName,
        fullName,
        description,
        region,
        mainUrl,
        avatar,
      })
      .returning({ id: profile.id });
  }
}
