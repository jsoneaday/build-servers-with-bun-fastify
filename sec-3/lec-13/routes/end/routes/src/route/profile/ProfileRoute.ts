import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";
import { Status404, Status500 } from "../ResponseTypes";

const profile: FastifyPluginAsync = async function (fastify) {
  const instance = fastify.withTypeProvider<TypeBoxTypeProvider>();

  instance.get(
    "/profile",
    {
      schema: {
        querystring: Type.Object({
          userName: Type.String(),
        }),
        response: {
          200: Type.Object({
            id: Type.BigInt(),
            createdAt: Type.Date(),
            updatedAt: Type.Date(),
            userName: Type.String(),
            fullName: Type.String(),
            description: Type.Optional(Type.String()),
            region: Type.Optional(Type.String()),
            mainUrl: Type.Optional(Type.String()),
            avatar: Type.Optional(Type.Any()),
          }),
          404: Status404,
        },
      },
    },
    async (request, reply) => {
      const result = await instance.repo.profileRepo.selectProfile(
        request.query.userName
      );

      if (!result) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Profile not found",
        });
      }

      return {
        id: result.id,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        userName: result.userName,
        fullName: result.fullName,
        description: result.description || undefined,
        region: result.region || undefined,
        mainUrl: result.mainUrl || undefined,
        avatar: result.avatar || undefined,
      };
    }
  );

  instance.post(
    "/profile",
    {
      schema: {
        body: Type.Object({
          userName: Type.String(),
          fullName: Type.String(),
          description: Type.Optional(Type.String()),
          region: Type.Optional(Type.String()),
          mainUrl: Type.Optional(Type.String()),
          avatar: Type.Optional(Type.Any()),
        }),
        response: Type.Object({
          200: Type.Object({
            id: Type.BigInt(),
          }),
          500: Status500,
        }),
      },
    },
    async (req, rep) => {
      const { userName, fullName, description, region, mainUrl, avatar } =
        req.body;
      const result = await instance.repo.profileRepo.insertProfile(
        userName,
        fullName,
        description,
        region,
        mainUrl,
        avatar
      );

      if (!result) {
        return rep.status(500).send({
          statusCode: 500,
          error: "Internal_Server_Error",
          message: "Failed to insert profile",
        });
      }

      return {
        id: result.id,
      };
    }
  );

  instance.get(
    "/followed",
    {
      schema: {
        querystring: Type.Object({
          followerId: Type.BigInt(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.BigInt(),
              createdAt: Type.Date(),
              updatedAt: Type.Date(),
              userName: Type.String(),
              fullName: Type.String(),
              description: Type.Optional(Type.String()),
              region: Type.Optional(Type.String()),
              mainUrl: Type.Optional(Type.String()),
              avatar: Type.Optional(Type.Any()),
            })
          ),
          404: Status404,
        },
      },
    },
    async (req, rep) => {
      const { followerId } = req.query;
      const result = await instance.repo.profileRepo.selectFollowedProfiles(
        followerId
      );

      if (!result) {
        return rep.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Profile not found",
        });
      }

      return result.map((profile) => ({
        id: profile.id,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        userName: profile.userName,
        fullName: profile.fullName,
        description: profile.description || undefined,
        region: profile.region || undefined,
        mainUrl: profile.mainUrl || undefined,
        avatar: profile.avatar || undefined,
      }));
    }
  );

  instance.get(
    "/followers",
    {
      schema: {
        querystring: Type.Object({
          followedId: Type.BigInt(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.BigInt(),
              createdAt: Type.Date(),
              updatedAt: Type.Date(),
              userName: Type.String(),
              fullName: Type.String(),
              description: Type.Optional(Type.String()),
              region: Type.Optional(Type.String()),
              mainUrl: Type.Optional(Type.String()),
              avatar: Type.Optional(Type.Any()),
            })
          ),
          404: Status404,
        },
      },
    },
    async (req, rep) => {
      const { followedId } = req.query;
      const result = await instance.repo.profileRepo.selectFollowerProfiles(
        followedId
      );

      if (!result) {
        return rep.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Profile not found",
        });
      }

      return result.map((profile) => ({
        id: profile.id,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        userName: profile.userName,
        fullName: profile.fullName,
        description: profile.description || undefined,
        region: profile.region || undefined,
        mainUrl: profile.mainUrl || undefined,
        avatar: profile.avatar || undefined,
      }));
    }
  );

  instance.post(
    "/follow",
    {
      schema: {
        body: Type.Object({
          followerId: Type.BigInt(),
          followedId: Type.BigInt(),
        }),
        response: Type.Object({
          200: Type.Object({
            followId: Type.BigInt(),
          }),
          500: Status500,
        }),
      },
    },
    async (req, rep) => {
      const { followerId, followedId } = req.body;
      const result = await instance.repo.profileRepo.insertFollow(
        followerId,
        followedId
      );

      if (!result) {
        return rep.status(500).send({
          statusCode: 500,
          error: "Internal_Server_Error",
          message: "Failed to insert follow",
        });
      }

      return {
        followId: result.id,
      };
    }
  );
};
export default profile;
