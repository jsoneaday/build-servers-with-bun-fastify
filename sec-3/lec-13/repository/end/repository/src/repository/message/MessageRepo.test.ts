import { expect, it, describe } from "bun:test";
import ProfileRepo from "../profile/ProfileRepo";
import Repository from "../Repository";
import MessageRepo from "./MessageRepo";
import { getNewProfile } from "../../__tests__/fixtures";
import { faker } from "@faker-js/faker";

const repo = new Repository();
const profileRepo = new ProfileRepo(repo);
const messageRepo = new MessageRepo(repo);

describe("MessageRepo", () => {
  it("selects messages of followed users", async () => {
    const { userName, fullName, description, region, mainUrl, avatar } =
      getNewProfile();
    const follower = await profileRepo.insertProfile(
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
      const followed = await profileRepo.insertProfile(
        userName,
        fullName,
        description,
        region,
        mainUrl,
        avatar
      );

      for (let i = 0; i < 2; i++) {
        followedMessages.push(
          await messageRepo.insertMessage(followed.id, faker.lorem.sentence())
        );
      }

      await profileRepo.insertFollow(follower.id, followed.id);
    }

    followedMessages = followedMessages.reverse();
    const resultMessages = await messageRepo.selectMessagesOfFollowed(
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
    const author = await profileRepo.insertProfile(
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
        await messageRepo.insertMessage(author.id, faker.lorem.sentence())
      );
    }

    authorMessages = authorMessages.reverse();
    const resultMessages = await messageRepo.selectMessagesByAuthorId(
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
    const author = await profileRepo.insertProfile(
      userName,
      fullName,
      description,
      region,
      mainUrl,
      avatar
    );

    const body = faker.lorem.sentence();
    const image = Buffer.from(faker.image.image());

    const message = await messageRepo.insertMessage(author.id, body, image);

    expect(message.authorId).toBe(author.id);
    expect(message.body).toBe(body);
    expect(message.image).toEqual(image);
  });

  it("creates a new response message successfully", async () => {
    const newResponder = getNewProfile();
    const responder = await profileRepo.insertProfile(
      newResponder.userName,
      newResponder.fullName,
      newResponder.description,
      newResponder.region,
      newResponder.mainUrl,
      newResponder.avatar
    );
    const newResponded = getNewProfile();
    const responded = await profileRepo.insertProfile(
      newResponded.userName,
      newResponded.fullName,
      newResponded.description,
      newResponded.region,
      newResponded.mainUrl,
      newResponded.avatar
    );

    const respondedBody = faker.lorem.sentence();
    const respondedImage = Buffer.from(faker.image.image());
    const respondedMessage = await messageRepo.insertMessage(
      responded.id,
      respondedBody,
      respondedImage
    );

    const responderBody = faker.lorem.sentence();
    const responderImage = Buffer.from(faker.image.image());
    const responderMessage = await messageRepo.insertMessage(
      responder.id,
      responderBody,
      responderImage,
      respondedMessage.id
    );

    const selectedResponderMessage = await messageRepo.selectMessageResponses(
      respondedMessage.id
    );
    expect(selectedResponderMessage.length).toBe(1);
    expect(selectedResponderMessage[0].responderMsg.id).toBe(
      responderMessage.id
    );
    expect(selectedResponderMessage[0].responderMsg.body).toBe(responderBody);
    expect(selectedResponderMessage[0].responderMsg.image).toEqual(
      responderImage
    );
  });
});
