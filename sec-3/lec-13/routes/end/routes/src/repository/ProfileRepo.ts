import { DB } from "./Repository";

export default class ProfileRepo {
  constructor(private readonly db: DB) {}

  async get(userName: string) {
    const profile = await this.db.query.message.findFirst({});
  }
}
