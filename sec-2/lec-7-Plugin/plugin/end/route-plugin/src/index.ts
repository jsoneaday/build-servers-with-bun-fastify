import Fastify from "fastify";
import syncplugin from "./syncplugin";
import typedplugin from "./typedplugin";
import scopedplugin from "./scopedplugin";
import loggerplugin from "./loggerplugin";

const server = Fastify({
  logger: {
    serializers: {
      user(req) {
        return {
          method: req.method,
          url: req.url,
          headers: req.headers,
          hostname: req.hostname,
          remoteAddress: req.ip,
          remotePort: req?.socket?.remotePort,
        };
      },
    },
  },
});

server.register(syncplugin);
server.register(typedplugin, {
  prefix: "/v1",
  myval: "test",
});
server.register(scopedplugin);

server.register(loggerplugin, {
  logSerializers: {
    user: (value: any) => `User value: ${value}`,
  },
});

server.listen({ port: 8080, host: "::1" }, async (err, address) => {
  if (err) {
    process.exit(1);
  }

  server.log.info(`server started at ${address}`);
});
