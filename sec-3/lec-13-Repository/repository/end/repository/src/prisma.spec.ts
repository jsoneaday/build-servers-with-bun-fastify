import { expect, describe, it } from "bun:test";
import { PrismaClient } from "@prisma/client";
import { getNewProfile } from "./__tests__/fixtures";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

describe("ProfileRepo", () => {
  it("creates a valid profile", async () => {
    const { userName, fullName, description, region, mainUrl, avatar } =
      getNewProfile();

    const profile = await prisma.profile.create({
      data: {
        userName,
        fullName,
        description,
        region,
        mainUrl,
        avatar,
      },
    });

    expect(profile.userName).toBe(userName);
    expect(profile.fullName).toBe(fullName);
    expect(profile.description).toBe(description);
    expect(profile.region).toBe(region);
    expect(profile.mainUrl).toBe(mainUrl);
    expect(profile.avatar).toEqual(avatar);
  });

  it("creates a valid profile with messages", async () => {
    const { userName, fullName, description, region, mainUrl, avatar } =
      getNewProfile();
    const messages = [
      { body: faker.lorem.sentence(1) },
      { body: faker.lorem.sentence(1) },
      { body: faker.lorem.sentence(1) },
    ];

    const profile = await prisma.profile.create({
      data: {
        userName,
        fullName,
        description,
        region,
        mainUrl,
        avatar,
        messages: {
          create: messages,
        },
      },
      include: {
        messages: true,
      },
    });

    expect(profile.userName).toBe(userName);
    expect(profile.fullName).toBe(fullName);
    expect(profile.description).toBe(description);
    expect(profile.region).toBe(region);
    expect(profile.mainUrl).toBe(mainUrl);
    expect(profile.avatar).toEqual(avatar);

    expect(profile.messages[0].body).toBe(messages[0].body);
    expect(profile.messages[1].body).toBe(messages[1].body);
    expect(profile.messages[2].body).toBe(messages[2].body);
  });

  it("update an existing profile", async () => {
    const {
      userName: userNameA,
      fullName: fullNameA,
      description: descriptionA,
      region: regionA,
      mainUrl: mainUrlA,
      avatar: avatarA,
    } = getNewProfile();
    let profileA = await prisma.profile.create({
      data: {
        userName: userNameA,
        fullName: fullNameA,
        description: descriptionA,
        region: regionA,
        mainUrl: mainUrlA,
        avatar: avatarA,
      },
      include: {
        messages: true,
      },
    });
    const {
      userName: userNameB,
      fullName: fullNameB,
      description: descriptionB,
      region: regionB,
      mainUrl: mainUrlB,
      avatar: avatarB,
    } = getNewProfile();
    let profileB = await prisma.profile.create({
      data: {
        userName: userNameB,
        fullName: fullNameB,
        description: descriptionB,
        region: regionB,
        mainUrl: mainUrlB,
        avatar: avatarB,
      },
      include: {
        messages: true,
      },
    });

    let message = await prisma.message.create({
      data: {
        body: faker.lorem.sentence(1),
        authorId: profileA.id,
      },
    });

    expect(profileA.id).toBe(message.authorId);

    message = await prisma.message.update({
      where: { id: message.id },
      data: {
        authorId: profileB.id,
      },
    });
    expect(message.authorId).toBe(profileB.id);
  });

  it("create message relation while creating profile", async () => {
    const {
      userName: userNameA,
      fullName: fullNameA,
      description: descriptionA,
      region: regionA,
      mainUrl: mainUrlA,
      avatar: avatarA,
    } = getNewProfile();

    let profile = await prisma.profile.create({
      data: {
        userName: userNameA,
        fullName: fullNameA,
        description: descriptionA,
        region: regionA,
        mainUrl: mainUrlA,
        avatar: avatarA,
        messages: {
          create: [{ body: "123" }],
        },
      },
      include: {
        messages: true,
      },
    });

    expect(profile.messages[0].body).toBe("123");
  });

  // it("creates a valid profile with messagaes", async () => {
  //   const { userName, fullName, description, region, mainUrl, avatar } =
  //     getNewProfile();
  //   const messages = [
  //     { body: faker.lorem.sentence(1) },
  //     { body: faker.lorem.sentence(1) },
  //     { body: faker.lorem.sentence(1) },
  //   ];
  //   const profile = await repo.profileRepo.insertProfileWithMessages(
  //     messages,
  //     userName,
  //     fullName,
  //     description,
  //     region,
  //     mainUrl,
  //     avatar
  //   );
  //   expect(profile.userName).toBe(userName);
  //   expect(profile.fullName).toBe(fullName);
  //   expect(profile.description).toBe(description);
  //   expect(profile.region).toBe(region);
  //   expect(profile.mainUrl).toBe(mainUrl);
  //   expect(profile.avatar).toEqual(avatar);

  //   const profileMessages = await repo.messageRepo.selectMessagesByAuthorId(
  //     profile.id
  //   );
  //   for (let i = 0; i < profileMessages.length; i++) {
  //     expect(profileMessages[i].body).toBe(messages[i].body);
  //   }
  // });

  // it("selects a valid profile", async () => {
  //   const { userName, fullName, description, region, mainUrl, avatar } =
  //     getNewProfile();

  //   await repo.profileRepo.insertProfile(
  //     userName,
  //     fullName,
  //     description,
  //     region,
  //     mainUrl,
  //     avatar
  //   );

  //   const selectedProfile = await repo.profileRepo.selectProfile(userName);
  //   expect(selectedProfile?.userName).toBe(userName);
  //   expect(selectedProfile?.fullName).toBe(fullName);
  //   expect(selectedProfile?.description).toBe(description);
  //   expect(selectedProfile?.region).toBe(region);
  //   expect(selectedProfile?.mainUrl).toBe(mainUrl);
  //   expect(selectedProfile?.avatar).toEqual(avatar);
  // });

  // it("selects profiles a user is a follower of", async () => {
  //   const { userName, fullName, description, region, mainUrl, avatar } =
  //     getNewProfile();

  //   // first create a profile that will be the follower
  //   const followerProfile = await repo.profileRepo.insertProfile(
  //     userName,
  //     fullName,
  //     description,
  //     region,
  //     mainUrl,
  //     avatar
  //   );

  //   // create multiple profiles to be followed
  //   const size = 4;
  //   let listOfFollowedProfiles: {
  //     id: bigint;
  //     createdAt: Date;
  //     updatedAt: Date;
  //     userName: string;
  //     fullName: string;
  //     description: string | null;
  //     region: string | null;
  //     mainUrl: string | null;
  //     avatar: Buffer | null;
  //   }[] = new Array(size);
  //   for (let i = 0; i < size; i++) {
  //     const userName = faker.internet.userName();
  //     const fullName = faker.person.fullName();
  //     const description = faker.lorem.sentences(2);
  //     const region = faker.location.country();
  //     const mainUrl = faker.internet.url();
  //     const avatar = Buffer.from(faker.image.avatar());

  //     const followedProfile = await repo.profileRepo.insertProfile(
  //       userName,
  //       fullName,
  //       description,
  //       region,
  //       mainUrl,
  //       avatar
  //     );
  //     listOfFollowedProfiles[i] = followedProfile;

  //     await repo.profileRepo.insertFollow(
  //       followerProfile.id,
  //       followedProfile.id
  //     );
  //   }

  //   const followedProfiles = await repo.profileRepo.selectFollowedProfiles(
  //     followerProfile.id
  //   );

  //   listOfFollowedProfiles = listOfFollowedProfiles.reverse();
  //   for (let i = 0; i < followedProfiles.length; i++) {
  //     const dbFollowedProfile = followedProfiles[i];
  //     const listedFollowedProfile = listOfFollowedProfiles[i];

  //     expect(dbFollowedProfile.userName).toBe(listedFollowedProfile.userName);
  //     expect(dbFollowedProfile.fullName).toBe(listedFollowedProfile.fullName);
  //     expect(dbFollowedProfile.description).toBe(
  //       listedFollowedProfile.description
  //     );
  //     expect(dbFollowedProfile.region).toBe(listedFollowedProfile.region);
  //     expect(dbFollowedProfile.mainUrl).toBe(listedFollowedProfile.mainUrl);
  //     expect(dbFollowedProfile.avatar).toEqual(listedFollowedProfile.avatar);
  //   }
  // });

  // it("select profiles that are following a followed", async () => {
  //   const { userName, fullName, description, region, mainUrl, avatar } =
  //     getNewProfile();

  //   const followedProfile = await repo.profileRepo.insertProfile(
  //     userName,
  //     fullName,
  //     description,
  //     region,
  //     mainUrl,
  //     avatar
  //   );

  //   // create multiple profiles to be followed
  //   const size = 4;
  //   let listOfFollowerProfiles: {
  //     id: bigint;
  //     createdAt: Date;
  //     updatedAt: Date;
  //     userName: string;
  //     fullName: string;
  //     description: string | null;
  //     region: string | null;
  //     mainUrl: string | null;
  //     avatar: Buffer | null;
  //   }[] = new Array(size);
  //   for (let i = 0; i < size; i++) {
  //     const userName = faker.internet.userName();
  //     const fullName = faker.person.fullName();
  //     const description = faker.lorem.sentences(2);
  //     const region = faker.location.country();
  //     const mainUrl = faker.internet.url();
  //     const avatar = Buffer.from(faker.image.avatar());

  //     const followerProfile = await repo.profileRepo.insertProfile(
  //       userName,
  //       fullName,
  //       description,
  //       region,
  //       mainUrl,
  //       avatar
  //     );
  //     listOfFollowerProfiles[i] = followerProfile;

  //     await repo.profileRepo.insertFollow(
  //       followerProfile.id,
  //       followedProfile.id
  //     );
  //   }

  //   const followerProfiles = await repo.profileRepo.selectFollowerProfiles(
  //     followedProfile.id
  //   );

  //   listOfFollowerProfiles = listOfFollowerProfiles.reverse();
  //   for (let i = 0; i < followerProfiles.length; i++) {
  //     const dbFollowerProfile = followerProfiles[i];
  //     const listedFollowerProfile = listOfFollowerProfiles[i];

  //     expect(dbFollowerProfile.userName).toBe(listedFollowerProfile.userName);
  //     expect(dbFollowerProfile.fullName).toBe(listedFollowerProfile.fullName);
  //     expect(dbFollowerProfile.description).toBe(
  //       listedFollowerProfile.description
  //     );
  //     expect(dbFollowerProfile.region).toBe(listedFollowerProfile.region);
  //     expect(dbFollowerProfile.mainUrl).toBe(listedFollowerProfile.mainUrl);
  //     expect(dbFollowerProfile.avatar).toEqual(listedFollowerProfile.avatar);
  //   }
  // });
});
