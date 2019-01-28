import configCheck from "./config";
configCheck(); // Make sure that the config we're reading from the .env is sane.

import { GraphQLServer } from "graphql-yoga";
import { json } from "body-parser";

import { validateJWT } from "./auth";
import { contextCreatorFactory, IntResolverContext } from "./graphqlContext";
import googleAuthRouter from "./routes/auth/google";
import { getShield, getResolvers } from "./graphql/index";

const Sentry = require("@sentry/node");

// This allows TypeScript to detect our global value
declare global {
  namespace NodeJS {
    interface Global {
      __rootdir__: string;
    }
  }
}

global.__rootdir__ = __dirname || process.cwd();

Sentry.init({
  dsn: "https://14952fe290964b8bb6a7c231d260a9f3@sentry.io/1369014",
  integrations: [
    new Sentry.Integrations.RewriteFrames({
      root: global.__rootdir__,
    }),
  ],
});

const makePublic = async (
  resolve,
  parent,
  args,
  context: IntResolverContext,
  info,
) => {
  context.isPublic = true;
  return resolve();
};

const publicRoutesMiddleware = {
  Query: {},
};

const authMiddleware = async (
  resolve,
  parent,
  args,
  context: IntResolverContext,
  info,
) => {
  if (context.isPublic) {
    return resolve();
  }

  const jwt = context.jwt;

  const me = await validateJWT(jwt);
  /*
  if (!me.isValid) {
    throw new Error("unauthorized");
  }*/
  context.id = me.uid;
  return resolve();
};

const contextGetter = contextCreatorFactory();

const server = new GraphQLServer({
  context: contextGetter,
  middlewares: [publicRoutesMiddleware, authMiddleware, getShield()],
  typeDefs: "./src/graphql/schema.graphql",
  resolvers: getResolvers(),
});
server.express.use(json());
server.express.use("/auth/google/", googleAuthRouter);

server.express.use("/test", (req, res) => {
  return res.send("testing...");
});

server
  .start({
    port: 4000,
    subscriptions: {
      onConnect: (connectionParams, ws) => {
        const jwt = connectionParams.Authorization;
        if (jwt) {
          return {
            jwt,
          };
        }

        throw new Error(
          "invalid credentials from incoming websocket connection.",
        );
      },
    },
  })
  .then(() => {
    console.warn("server ready");
  });
