import { expect, it, describe } from "bun:test";
import Repository, { setupDrizzle, setupQueryClient } from "./Repository";
import { setupProcessEnv } from "../__tests__/fixtures";
import ProfileRepo from "./ProfileRepo";

setupProcessEnv();
const db_conn = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;
console.log("db_conn", db_conn);
const queryClient = setupQueryClient(db_conn);
const db = setupDrizzle(queryClient);
const profileRepo = new ProfileRepo(new Repository(db_conn, queryClient, db));

describe("ProfileRepo", () => {
  it("create should create a profile", async () => {
    const userName = "user";
    const fullName = "full name";
    const description = "description";
    console.log("start create");
    const result = await profileRepo.create(userName, fullName, description);
    console.log("end create");

    expect(result[0].id).toBeGreaterThan(BigInt(0));
  });
});
