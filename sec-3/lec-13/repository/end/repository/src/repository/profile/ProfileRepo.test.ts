import { expect, describe, it } from "bun:test";
import Repository from "../Repository";
import ProfileRepo from "./ProfileRepo";
import { faker } from "@faker-js/faker";

const repo = new Repository();
const profileRepo = new ProfileRepo(repo);

describe("ProfileRepo", () => {
  it("create should create a profile", async () => {
    const userName = faker.internet.userName();
    const fullName = faker.name.fullName();
    const description = faker.lorem.sentences(2);
    const region = faker.address.country();
    const mainUrl = faker.internet.url();
    const avatar = Buffer.from(faker.image.avatar());

    const profile = await profileRepo.insert(
      userName,
      fullName,
      description,
      region,
      mainUrl,
      avatar
    );
    expect(profile.userName).toBe(userName);
    expect(profile.fullName).toBe(fullName);
    expect(profile.description).toBe(description);
    expect(profile.region).toBe(region);
    expect(profile.mainUrl).toBe(mainUrl);
    expect(profile.avatar).toEqual(avatar);
  });
});
