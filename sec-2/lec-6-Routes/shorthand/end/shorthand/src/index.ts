import Fastify from "fastify";

const server = Fastify();

server.get("/", (request, reply) => {
  return "hello world!";
});

server.get<{
  Headers: { myheader: string };
  Querystring: { id: string };
  Reply: { 200: { status: string } };
}>("/employee", async (request, reply) => {
  // const header = request.headers.myheader;
  // attempting to return undefined causes a hang and ultimately failure of the route
  // return header ? header : "not found";

  // const queryId = request.query.id;
  // return queryId;

  // best practice on async handlers to return or await reply.send
  return reply.status(200).send({ status: "success!" });
});

server.post<{
  Body: { id: string };
}>("/employee", async (request, reply) => {
  const id = request.body.id;
  return id;
});

server.get<{ Params: { id: string } }>(
  "/employee/:id",
  async (request, reply) => {
    const paramId = request.params.id;
    return paramId;
  }
);

server.listen({ port: 8080, host: "::1" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`server has started on ${address}`);
});
