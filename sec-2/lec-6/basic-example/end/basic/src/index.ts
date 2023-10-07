import Fastify from "fastify";

const server = Fastify();

server.get("/", (request, reply) => {
  return "hello world!";
});

server.get<{
  Headers: { "my-header": string };
  Querystring: { id: string };
  Reply: { 200: { status: "success!" } };
}>("/employee", (request, reply) => {
  // const header = request.headers["my-headers"];
  // // attempting to return undefined causes a hang and ultimately failure of the route
  // return header ? header : "not found";

  // const queryId = request.query.id;
  // return queryId;

  reply.status(200).send({ status: "success!" });
});

server.post<{
  Body: { id: string };
}>("/employee", async (request, reply) => {
  const id = request.body.id;
  return id;
});

server.get<{ Params: { id: string } }>("/employee/:id", (request, reply) => {
  const paramId = request.params.id;
  return paramId;
});

server.setErrorHandler((err, req, rep) => {
  console.log("setErrorHandler");
});

server.listen({ port: 8080, host: "::1" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`server has started on ${address}`);
});
