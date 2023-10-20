import { expect, describe, it } from "bun:test";
import { fastifyInstance } from "../../__tests__/fixtures";

const fastify = fastifyInstance();

describe("ProfileRoute", () => {
  it("should return profile", async () => {
    console.log("start test");
    const response = await fastify.inject({
      method: "GET",
      url: "/profile?userName=foo",
    });
    console.log("got response", response);
    expect(response.statusCode).toEqual(200);
  });
});
