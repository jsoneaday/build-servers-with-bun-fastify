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
    const newResponder = getNewProfile();
    const responder = await repo.profileRepo.insertProfile(
      newResponder.userName,
      newResponder.fullName,
      newResponder.description,
      newResponder.region,
      newResponder.mainUrl,
      newResponder.avatar
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

    const responderBody = faker.lorem.sentence();
    const responderImage = Buffer.from(faker.image.image());
    const responderMessage = await repo.messageRepo.insertMessage(
      responder.id,
      responderBody,
      responderImage,
      respondedMessage.id
    );

    const selectedResponderMessage =
      await repo.messageRepo.selectMessageResponses(respondedMessage.id);
    expect(selectedResponderMessage.length).toBe(1);
    expect(selectedResponderMessage[0].responder.id).toBe(responderMessage.id);
    expect(selectedResponderMessage[0].responder.body).toBe(responderBody);
    expect(selectedResponderMessage[0].responder.image).toEqual(responderImage);
  });

  it("creates a new broadcast message successfully", async () => {
    const newBroadcaster = getNewProfile();
    const broadcaster = await repo.profileRepo.insertProfile(
      newBroadcaster.userName,
      newBroadcaster.fullName,
      newBroadcaster.description,
      newBroadcaster.region,
      newBroadcaster.mainUrl,
      newBroadcaster.avatar
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

    const broadcasterAdditionalMsg = "I am broadcasting original message";
    const broadcasterBody = faker.lorem.sentence();
    const broadcasterImage = Buffer.from(faker.image.image());
    const broadcasterMessage = await repo.messageRepo.insertMessage(
      broadcaster.id,
      broadcasterBody,
      broadcasterImage,
      undefined,
      broadcastMessage.id,
      broadcasterAdditionalMsg
    );

    const selectedBroadcasterMessages =
      await repo.messageRepo.selectMessageBroadcasts(broadcastMessage.id);
    expect(selectedBroadcasterMessages.length).toBe(1);
    expect(selectedBroadcasterMessages[0].broadcaster.id).toBe(
      broadcasterMessage.id
    );
    expect(selectedBroadcasterMessages[0].broadcaster.body).toBe(
      broadcasterBody
    );
    expect(selectedBroadcasterMessages[0].broadcaster.image).toEqual(
      broadcasterImage
    );
    expect(
      selectedBroadcasterMessages[0].broadcaster.additionalMessage
    ).toEqual(broadcasterAdditionalMsg);
  });
});