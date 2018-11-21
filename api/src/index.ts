import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { GraphQLServer } from "graphql-yoga";
import { json } from "body-parser";

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
