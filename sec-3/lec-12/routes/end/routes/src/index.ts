import app from "./app";
import Repository from "./repository/Repository";

const server = app((fastify) => {
  // fastify.decorate("repo", new Repository());
  // fastify.register(import("./route/profile/ProfileRoute"));
  // fastify.addHook("onClose", async () => {
  //   await fastify.repo.close();
  // });
});

server.listen(
  { port: Number(process.env.PORT), host: process.env.HOST },
  (err, address) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    server.log.info("Let's go!");
  }
);
