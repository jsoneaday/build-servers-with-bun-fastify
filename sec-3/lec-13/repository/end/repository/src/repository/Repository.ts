import { PrismaClient } from "@prisma/client";

export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
}

export default class Repository {
  private _prisma: PrismaClient;
  get prisma() {
    return this._prisma;
  }

  constructor() {
    this._prisma = new PrismaClient();
  }

  async close() {
    await this._prisma.$disconnect();
  }
}
