import Fastify from "fastify";

const server = Fastify();

server.get("/", (request, reply) => {
  return "hello world!";
});

server.get<{
  Headers: { myheader: number };
  Querystring: { id: string };
  Reply: { 200: { status: string } };
}>("/employee", async (request, reply) => {
  // return req.headers.myheader;

  // return `you passed ${req.query.id}`;

  return reply.status(200).send({ status: "success!" });
});

server.post<{
  Body: { userName: string };
}>("/employee", async (req, rep) => {
  return `userName is ${req.body.userName}`;
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
