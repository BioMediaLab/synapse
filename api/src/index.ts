import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { GraphQLServer } from "graphql-yoga";

import { validateJWT } from "./auth";
import { resolvers } from "./graphql/main";
import { contextCreatorFactory, IntResolverContext } from "./graphqlContext";
import googleAuthRouter from "./routes/auth/google";

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
  Query: {
    confirmSignupGoogle: makePublic,
  },
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
  if (!me.isValid) {
    throw new Error("unauthorized");
  }
  context.id = me.uid;
  return resolve();
};

const contextGetter = contextCreatorFactory();

const server = new GraphQLServer({
  context: contextGetter,
  middlewares: [publicRoutesMiddleware, authMiddleware],
  typeDefs: "./src/graphql/schema.graphql",
  resolvers,
});

server.express.use("/auth/google/", googleAuthRouter);

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
        console.warn("invalid creds from incoming websocket conn");
        throw new Error(
          "invalid credentials from incoming websocket connection.",
        );
      },
    },
  })
  .then(() => {
    console.warn("server ready");
  });
