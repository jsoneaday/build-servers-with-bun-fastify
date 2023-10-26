import { PrismaClient } from "@prisma/client";
import ProfileRepo from "./profile/ProfileRepo";
import MessageRepo from "./message/MessageRepo";

export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
}

export default class Repository {
  private readonly prisma: PrismaClient;
  readonly profileRepo: ProfileRepo;
  readonly messageRepo: MessageRepo;

  constructor() {
    this.prisma = new PrismaClient();
    this.profileRepo = new ProfileRepo(this.prisma);
    this.messageRepo = new MessageRepo(this.prisma);
  }

  async close() {
    await this.prisma.$disconnect();
  }
}
