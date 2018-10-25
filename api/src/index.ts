import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { GraphQLServer } from "graphql-yoga";

import { validateJWT } from "./auth";
import { resolvers } from "./graphql/main";
import { contextCreatorFactory } from "./graphqlContext";
import googleAuthRouter from "./routes/auth/google";

const makePublic = async (resolve, parent, args, context, info) => {
  context.request.isPublic = true;
  return resolve();
};

const publicRoutesMiddleware = {
  Query: {
    confirmSignupGoogle: makePublic,
  },
};

const authMiddleware = async (resolve, parent, args, context, info) => {
  if (context.request && context.request.isPublic) {
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
        throw new Error(
          "invalid credentials from incoming websocket connection.",
        );
      },
    },
  })
  .then(() => {
    console.log("server ready");
  });
