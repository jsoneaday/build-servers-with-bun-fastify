import Fastify from "fastify";
import profiles from "./routes/profiles/profiles";
import db from "./repository/Repository";

const server = Fastify({
  logger: true,
});

server.decorate("db", db);

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
