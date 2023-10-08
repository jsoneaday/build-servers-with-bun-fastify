import { FastifyInstance, FastifyPluginAsync } from "fastify";

// creating encapsulation by creating a new scope from a plugin
// fastify instance is a context of related data and fields
// creating a plugin creates a scope for this data that is only observable by descendants and not ancestors
const scopedplugin: FastifyPluginAsync = async function (
  fastify: FastifyInstance
) {
  fastify.decorate("sharedval", 24);
  fastify.log.info(`parent's sharedval is ${fastify.sharedval}`);
  fastify.log.info(
    `from parent child's childsharedval is ${
      fastify.childsharedval && fastify.childsharedval()
    }`
  );

  fastify.register((childfastify, options, done) => {
    childfastify.log.info(`child's sharedval is ${childfastify.sharedval}`);

    childfastify.decorate("childsharedval", () => 35);
    childfastify.log.info(
      `from child child's childsharedval is ${
        childfastify.childsharedval && childfastify.childsharedval()
      }`
    );

    done();
  });
};

export default scopedplugin;
