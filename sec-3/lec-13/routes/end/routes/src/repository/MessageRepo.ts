import Repository, { DB } from "./Repository";

export default class MessageRepo {
  constructor(private readonly repo: Repository) {}
}
