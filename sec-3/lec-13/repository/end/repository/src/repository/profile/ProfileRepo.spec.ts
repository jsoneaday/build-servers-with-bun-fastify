import { expect, describe, it } from "bun:test";
import Repository from "../Repository";
import ProfileRepo from "./ProfileRepo";
import { faker } from "@faker-js/faker";
import { getNewProfile } from "../../__tests__/fixtures";

const repo = new Repository();

describe("ProfileRepo", () => {
  it("creates a valid profile", async () => {
    const { userName, fullName, description, region, mainUrl, avatar } =
      getNewProfile();

    const profile = await repo.profileRepo.insertProfile(
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

    await repo.profileRepo.insertProfile(
      userName,
      fullName,
      description,
      region,
      mainUrl,
      avatar
    );

    const selectedProfile = await repo.profileRepo.selectProfile(userName);
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
    const followerProfile = await repo.profileRepo.insertProfile(
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

      const followedProfile = await repo.profileRepo.insertProfile(
        userName,
        fullName,
        description,
        region,
        mainUrl,
        avatar
      );
      listOfFollowedProfiles[i] = followedProfile;

      await repo.profileRepo.insertFollow(
        followerProfile.id,
        followedProfile.id
      );
    }

    const followedProfiles = await repo.profileRepo.selectFollowedProfiles(
      followerProfile.id
    );

    listOfFollowedProfiles = listOfFollowedProfiles.reverse();
    for (let i = 0; i < followedProfiles.length; i++) {
      const dbFollowedProfile = followedProfiles[i];
      const listedFollowedProfile = listOfFollowedProfiles[i];

      expect(dbFollowedProfile.userName).toBe(listedFollowedProfile.userName);
      expect(dbFollowedProfile.fullName).toBe(listedFollowedProfile.fullName);
      expect(dbFollowedProfile.description).toBe(
        listedFollowedProfile.description
      );
      expect(dbFollowedProfile.region).toBe(listedFollowedProfile.region);
      expect(dbFollowedProfile.mainUrl).toBe(listedFollowedProfile.mainUrl);
      expect(dbFollowedProfile.avatar).toEqual(listedFollowedProfile.avatar);
    }
  });

  it("select profiles that are following a followed", async () => {
    const { userName, fullName, description, region, mainUrl, avatar } =
      getNewProfile();

    const followedProfile = await repo.profileRepo.insertProfile(
      userName,
      fullName,
      description,
      region,
      mainUrl,
      avatar
    );

    // create multiple profiles to be followed
    const size = 4;
    let listOfFollowerProfiles: {
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

      const followerProfile = await repo.profileRepo.insertProfile(
        userName,
        fullName,
        description,
        region,
        mainUrl,
        avatar
      );
      listOfFollowerProfiles[i] = followerProfile;

      await repo.profileRepo.insertFollow(
        followerProfile.id,
        followedProfile.id
      );
    }

    const followerProfiles = await repo.profileRepo.selectFollowerProfiles(
      followedProfile.id
    );

    listOfFollowerProfiles = listOfFollowerProfiles.reverse();
    for (let i = 0; i < followerProfiles.length; i++) {
      const dbFollowerProfile = followerProfiles[i];
      const listedFollowerProfile = listOfFollowerProfiles[i];

      expect(dbFollowerProfile.userName).toBe(listedFollowerProfile.userName);
      expect(dbFollowerProfile.fullName).toBe(listedFollowerProfile.fullName);
      expect(dbFollowerProfile.description).toBe(
        listedFollowerProfile.description
      );
      expect(dbFollowerProfile.region).toBe(listedFollowerProfile.region);
      expect(dbFollowerProfile.mainUrl).toBe(listedFollowerProfile.mainUrl);
      expect(dbFollowerProfile.avatar).toEqual(listedFollowerProfile.avatar);
    }
  });
});
