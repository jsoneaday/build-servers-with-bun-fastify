import Fastify from "fastify";
import { routes as devRoutes } from "./routes/developer/developer";
import todo from "./routes/todo/todo";

const server = Fastify({
  logger: true,
});

server.register(todo, {
  logLevel: "info",
  prefix: "/v1",
});

server.get("/", async (request, reply) => {
  return { hello: "world!" };
});

server.listen({ port: 8080, host: "::1" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
