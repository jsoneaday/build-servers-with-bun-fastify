import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const server = Fastify({
  logger: {
    level: "info",
  },
}).withTypeProvider<TypeBoxTypeProvider>();

server.listen({ port: 8080, host: "::1" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
