import Fastify from "fastify";
import profiles from "./routes/profiles/profiles";
import dbConnector from "./dbConnector";

const server = Fastify({
  logger: true,
});

//server.register(dbConnector);
server.register(profiles, {
  logLevel: "info",
  prefix: "/v1",
  mytest: "mytest",
});

server.get("/", async (request, reply) => {
  return { hello: "world!" };
});

server.listen({ port: 8080, host: "::1" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
