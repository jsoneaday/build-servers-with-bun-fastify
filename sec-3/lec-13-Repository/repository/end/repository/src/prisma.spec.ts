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

  it("create message relation while creating profile", async () => {
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
        body: "123",
        authorId: profileA.id,
      },
    });

    expect(message.authorId).toBe(profileA.id);

    profileB = await prisma.profile.update({
      where: { id: profileB.id },
      data: {
        messages: {
          connect: [{ id: message.id }],
        },
      },
      include: {
        messages: true,
      },
    });
    expect(profileB.messages[0].id).toBe(message.id);

    let newProfileA = await prisma.profile.findFirst({
      where: { id: profileA.id },
      include: {
        messages: true,
      },
    });

    expect(newProfileA?.messages.length).toBe(0);
  });

  it("select only userName and fullName from profile", async () => {
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

    const message = await prisma.message.create({
      data: {
        body: "123",
        authorId: profileA.id,
      },
    });

    let selectedProfile = await prisma.profile.findFirstOrThrow({
      select: {
        userName: true,
        fullName: true,
        messages: true,
      },
      where: {
        id: profileA.id,
      },
      // include: {
      //   messages: true,
      // },
    });

    expect(selectedProfile.userName).toBe(profileA.userName);
  });

  it("select multiple profiles", async () => {
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

    const message = await prisma.message.create({
      data: {
        body: "123",
        authorId: profileA.id,
      },
    });

    let selectedProfiles = await prisma.profile.findMany({
      where: {
        messages: {
          some: {
            id: {
              in: [BigInt(13425435), BigInt(23245435), message.id],
            },
          },
        },
        // OR: [
        //   {
        //     userName: {
        //       endsWith: profileA.userName.substring(2),
        //     },
        //   },
        //   {
        //     userName: {
        //       contains: profileB.userName.substring(2),
        //     },
        //   },
        // ],
      },
    });

    expect(selectedProfiles.length).toBe(1);
  });
});
