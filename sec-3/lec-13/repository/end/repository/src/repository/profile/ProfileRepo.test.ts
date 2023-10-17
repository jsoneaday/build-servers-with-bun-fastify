import { expect, describe, it } from "bun:test";
import Repository from "../Repository";
import ProfileRepo from "./ProfileRepo";
import { faker } from "@faker-js/faker";
import { getNewProfile } from "../../__tests__/fixtures";

const repo = new Repository();
const profileRepo = new ProfileRepo(repo);

describe("ProfileRepo", () => {
  it("creates a valid profile", async () => {
    const { userName, fullName, description, region, mainUrl, avatar } =
      getNewProfile();

    const profile = await profileRepo.insertProfile(
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

  it("selects a valid profile", async () => {
    const { userName, fullName, description, region, mainUrl, avatar } =
      getNewProfile();

    await profileRepo.insertProfile(
      userName,
      fullName,
      description,
      region,
      mainUrl,
      avatar
    );

    const selectedProfile = await profileRepo.selectProfile(userName);
    expect(selectedProfile?.userName).toBe(userName);
    expect(selectedProfile?.fullName).toBe(fullName);
    expect(selectedProfile?.description).toBe(description);
    expect(selectedProfile?.region).toBe(region);
    expect(selectedProfile?.mainUrl).toBe(mainUrl);
    expect(selectedProfile?.avatar).toEqual(avatar);
  });

  it("selects profiles a user is a follower of", async () => {
    const { userName, fullName, description, region, mainUrl, avatar } =
      getNewProfile();

    // first create a profile that will be the follower
    const followerProfile = await profileRepo.insertProfile(
      userName,
      fullName,
      description,
      region,
      mainUrl,
      avatar
    );

    // create multiple profiles to be followed
    const size = 4;
    let listOfFollowedProfiles: {
      id: bigint;
      createdAt: Date;
      updatedAt: Date;
      userName: string;
      fullName: string;
      description: string | null;
      region: string | null;
      mainUrl: string | null;
      avatar: Buffer | null;
    }[] = new Array(size);
    for (let i = 0; i < size; i++) {
      const userName = faker.internet.userName();
      const fullName = faker.person.fullName();
      const description = faker.lorem.sentences(2);
      const region = faker.location.country();
      const mainUrl = faker.internet.url();
      const avatar = Buffer.from(faker.image.avatar());

      const followedProfile = await profileRepo.insertProfile(
        userName,
        fullName,
        description,
        region,
        mainUrl,
        avatar
      );
      listOfFollowedProfiles[i] = followedProfile;

      await profileRepo.insertFollow(followerProfile.id, followedProfile.id);
    }

    const followedProfiles = await profileRepo.selectFollowedProfiles(
      followerProfile.id
    );

    listOfFollowedProfiles = listOfFollowedProfiles.reverse();
    for (let i = 0; i < followedProfiles.length; i++) {
      const dbFollowedProfile = followedProfiles[i];
      const listedFollowedProfile = listOfFollowedProfiles[i];

      expect(dbFollowedProfile.followed.userName).toBe(
        listedFollowedProfile.userName
      );
      expect(dbFollowedProfile.followed.fullName).toBe(
        listedFollowedProfile.fullName
      );
      expect(dbFollowedProfile.followed.description).toBe(
        listedFollowedProfile.description
      );
      expect(dbFollowedProfile.followed.region).toBe(
        listedFollowedProfile.region
      );
      expect(dbFollowedProfile.followed.mainUrl).toBe(
        listedFollowedProfile.mainUrl
      );
      expect(dbFollowedProfile.followed.avatar).toEqual(
        listedFollowedProfile.avatar
      );
    }
  });
});
