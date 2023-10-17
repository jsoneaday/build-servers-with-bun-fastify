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
});
