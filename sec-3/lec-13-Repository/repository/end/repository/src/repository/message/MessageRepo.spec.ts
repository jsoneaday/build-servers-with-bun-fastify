import { expect, it, describe } from "bun:test";
import Repository from "../Repository";
import { getNewProfile } from "../../__tests__/fixtures";
import { faker } from "@faker-js/faker";

const repo = new Repository();

describe("MessageRepo", () => {
  it("selects messages of followed users", async () => {
    const { userName, fullName, description, region, mainUrl, avatar } =
      getNewProfile();
    const follower = await repo.profileRepo.insertProfile(
      userName,
      fullName,
      description,
      region,
      mainUrl,
      avatar
    );

    let followedMessages = [];
    for (let i = 0; i < 5; i++) {
      const { userName, fullName, description, region, mainUrl, avatar } =
        getNewProfile();
      const followed = await repo.profileRepo.insertProfile(
        userName,
        fullName,
        description,
        region,
        mainUrl,
        avatar
      );

      for (let i = 0; i < 2; i++) {
        followedMessages.push(
          await repo.messageRepo.insertMessage(
            followed.id,
            faker.lorem.sentence()
          )
        );
      }

      await repo.profileRepo.insertFollow(follower.id, followed.id);
    }

    followedMessages = followedMessages.reverse();
    const resultMessages = await repo.messageRepo.selectMessagesOfFollowed(
      follower.id
    );
    for (let i = 0; i < resultMessages.length; i++) {
      const resultMessage = resultMessages[i];
      const followedMessage = followedMessages[i];
      expect(resultMessage.id).toBe(followedMessage.id);
      expect(resultMessage.body).toBe(followedMessage.body);
      expect(resultMessage.authorId).toBe(followedMessage.authorId);
    }
  });

  it("selects messages by author id", async () => {
    const { userName, fullName, description, region, mainUrl, avatar } =
      getNewProfile();
    const author = await repo.profileRepo.insertProfile(
      userName,
      fullName,
      description,
      region,
      mainUrl,
      avatar
    );

    let authorMessages = [];
    for (let i = 0; i < 5; i++) {
      authorMessages.push(
        await repo.messageRepo.insertMessage(author.id, faker.lorem.sentence())
      );
    }

    authorMessages = authorMessages.reverse();
    const resultMessages = await repo.messageRepo.selectMessagesByAuthorId(
      author.id
    );
    for (let i = 0; i < resultMessages.length; i++) {
      const resultMessage = resultMessages[i];
      const authorMessage = authorMessages[i];
      expect(resultMessage.id).toBe(authorMessage.id);
      expect(resultMessage.body).toBe(authorMessage.body);
      expect(resultMessage.authorId).toBe(authorMessage.authorId);
    }
  });

  it("creates a new stand alone message successfully", async () => {
    const { userName, fullName, description, region, mainUrl, avatar } =
      getNewProfile();
    const author = await repo.profileRepo.insertProfile(
      userName,
      fullName,
      description,
      region,
      mainUrl,
      avatar
    );

    const body = faker.lorem.sentence();
    const image = Buffer.from(faker.image.image());

    const message = await repo.messageRepo.insertMessage(
      author.id,
      body,
      image
    );

    expect(message.authorId).toBe(author.id);
    expect(message.body).toBe(body);
    expect(message.image).toEqual(image);
  });

  it("creates a new response message successfully", async () => {
    const newResponderA = getNewProfile();
    const responderA = await repo.profileRepo.insertProfile(
      newResponderA.userName,
      newResponderA.fullName,
      newResponderA.description,
      newResponderA.region,
      newResponderA.mainUrl,
      newResponderA.avatar
    );
    const newResponderB = getNewProfile();
    const responderB = await repo.profileRepo.insertProfile(
      newResponderB.userName,
      newResponderB.fullName,
      newResponderB.description,
      newResponderB.region,
      newResponderB.mainUrl,
      newResponderB.avatar
    );

    const newResponded = getNewProfile();
    const responded = await repo.profileRepo.insertProfile(
      newResponded.userName,
      newResponded.fullName,
      newResponded.description,
      newResponded.region,
      newResponded.mainUrl,
      newResponded.avatar
    );

    const respondedBody = faker.lorem.sentence();
    const respondedImage = Buffer.from(faker.image.image());
    const respondedMessage = await repo.messageRepo.insertMessage(
      responded.id,
      respondedBody,
      respondedImage
    );

    const responderBodyA = faker.lorem.sentence();
    const responderImageA = Buffer.from(faker.image.image());
    const responderMessageA = await repo.messageRepo.insertMessage(
      responderA.id,
      responderBodyA,
      responderImageA,
      respondedMessage.id
    );
    const responderBodyB = faker.lorem.sentence();
    const responderImageB = Buffer.from(faker.image.image());
    const responderMessageB = await repo.messageRepo.insertMessage(
      responderB.id,
      responderBodyB,
      responderImageB,
      respondedMessage.id
    );

    const selectedResponderMessages =
      await repo.messageRepo.selectMessageResponses(respondedMessage.id);
    expect(selectedResponderMessages.length).toBe(2);
    expect(selectedResponderMessages[1].id).toBe(responderMessageA.id);
    expect(selectedResponderMessages[1].body).toBe(responderBodyA);
    expect(selectedResponderMessages[1].image).toEqual(responderImageA);
    expect(selectedResponderMessages[0].id).toBe(responderMessageB.id);
    expect(selectedResponderMessages[0].body).toBe(responderBodyB);
    expect(selectedResponderMessages[0].image).toEqual(responderImageB);

    expect(
      selectedResponderMessages[0].updatedAt >
        selectedResponderMessages[1].updatedAt
    );
  });

  it("creates a new broadcast message successfully", async () => {
    const newBroadcasterA = getNewProfile();
    const broadcasterA = await repo.profileRepo.insertProfile(
      newBroadcasterA.userName,
      newBroadcasterA.fullName,
      newBroadcasterA.description,
      newBroadcasterA.region,
      newBroadcasterA.mainUrl,
      newBroadcasterA.avatar
    );
    const newBroadcasterB = getNewProfile();
    const broadcasterB = await repo.profileRepo.insertProfile(
      newBroadcasterB.userName,
      newBroadcasterB.fullName,
      newBroadcasterB.description,
      newBroadcasterB.region,
      newBroadcasterB.mainUrl,
      newBroadcasterB.avatar
    );

    const newBroadcast = getNewProfile();
    const broadcast = await repo.profileRepo.insertProfile(
      newBroadcast.userName,
      newBroadcast.fullName,
      newBroadcast.description,
      newBroadcast.region,
      newBroadcast.mainUrl,
      newBroadcast.avatar
    );

    const broadcastBody = faker.lorem.sentence();
    const broadcastImage = Buffer.from(faker.image.image());
    const broadcastMessage = await repo.messageRepo.insertMessage(
      broadcast.id,
      broadcastBody,
      broadcastImage
    );

    const broadcasterAdditionalMsgA =
      "I am broadcasting original message for A";
    const broadcasterBodyA = faker.lorem.sentence();
    const broadcasterImageA = Buffer.from(faker.image.image());
    const broadcasterMessageA = await repo.messageRepo.insertMessage(
      broadcasterA.id,
      broadcasterBodyA,
      broadcasterImageA,
      undefined,
      broadcastMessage.id,
      broadcasterAdditionalMsgA
    );
    const broadcasterAdditionalMsgB =
      "I am broadcasting original message for B";
    const broadcasterBodyB = faker.lorem.sentence();
    const broadcasterImageB = Buffer.from(faker.image.image());
    const broadcasterMessageB = await repo.messageRepo.insertMessage(
      broadcasterB.id,
      broadcasterBodyB,
      broadcasterImageB,
      undefined,
      broadcastMessage.id,
      broadcasterAdditionalMsgB
    );

    const selectedBroadcasterMessages =
      await repo.messageRepo.selectMessageBroadcasts(broadcastMessage.id);
    expect(selectedBroadcasterMessages.length).toBe(2);
    expect(selectedBroadcasterMessages[1].id).toBe(broadcasterMessageA.id);
    expect(selectedBroadcasterMessages[1].body).toBe(broadcasterBodyA);
    expect(selectedBroadcasterMessages[1].image).toEqual(broadcasterImageA);
    expect(selectedBroadcasterMessages[1].additionalMessage).toEqual(
      broadcasterAdditionalMsgA
    );
    expect(selectedBroadcasterMessages[0].id).toBe(broadcasterMessageB.id);
    expect(selectedBroadcasterMessages[0].body).toBe(broadcasterBodyB);
    expect(selectedBroadcasterMessages[0].image).toEqual(broadcasterImageB);
    expect(selectedBroadcasterMessages[0].additionalMessage).toEqual(
      broadcasterAdditionalMsgB
    );

    expect(
      selectedBroadcasterMessages[0].updatedAt >
        selectedBroadcasterMessages[1].updatedAt
    );
  });
});
