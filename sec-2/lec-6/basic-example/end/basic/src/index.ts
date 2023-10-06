import Fastify from "fastify";

const server = Fastify();

server.get("/", async (request, reply) => {
  return "hello world!";
});

server.listen({ port: 8080, host: "::1" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
