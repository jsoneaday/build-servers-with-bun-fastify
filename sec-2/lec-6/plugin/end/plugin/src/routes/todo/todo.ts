import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

interface IQuerystring {
  username: string;
  password: string;
}
interface IHeaders {
  "h-Custom": string;
}
interface IReply {
  200: { success: boolean };
  302: { url: string };
  "4xx": { error: string };
}

export default async function todo(fastify: FastifyInstance, options: any) {
  fastify.log.info("global options:", options);

  fastify.get<{
    Querystring: IQuerystring;
    Headers: IHeaders;
    Reply: IReply;
  }>("/todo", options, async (request: FastifyRequest, reply: FastifyReply) => {
    fastify.log.info("global options:", options);
    // const { username, password } = request.query;
    // const customerHeader = request.headers["h-Custom"];

    return reply.code(200).send({ success: true });
  });
}
