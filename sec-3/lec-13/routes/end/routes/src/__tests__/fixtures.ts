import { faker } from "@faker-js/faker";
import Repository from "../repository/Repository";
import app from "../app";

export function fastifyInstance() {
  return app((fastify) => {
    fastify.decorate("repo", new Repository());
    fastify.register(import("../route/profile/ProfileRoute"));
    console.log("finished registrations");
  });
}

export function getNewProfile() {
  return {
    userName: faker.internet.userName(),
    fullName: faker.person.fullName(),
    description: faker.lorem.sentences(2),
    region: faker.location.country(),
    mainUrl: faker.internet.url(),
    avatar: Buffer.from(faker.image.avatar()),
  };
}
