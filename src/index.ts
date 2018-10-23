import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { GraphQLServer, PubSub } from "graphql-yoga";

import { prisma } from "../generated/prisma";
import { validateJWT } from "./auth";
import bindingDB from "./db";
import { resolvers } from "./graphql/main";
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

  // when using websockets for subscription the normal request
  // object is not populated.
  let jwt: string;
  try {
    jwt = context.request.get("authorization");
  } catch {
    jwt = context.connection.context.authorization;
  }

  const me = await validateJWT(jwt);
  if (!me.isValid) {
    throw new Error("unauthorized");
  }
  context.id = me.uid;
  return resolve();
};

const pubsub = new PubSub();

const server = new GraphQLServer({
  context: req => ({ ...req, bindingDB, db: prisma, pubsub }),
  middlewares: [publicRoutesMiddleware, authMiddleware],
  typeDefs: "./src/graphql/schema.graphql",
  resolvers,
});

server.express.use("/auth/google/", googleAuthRouter);

server
  .start({
    port: 4000,
  })
  .then(() => {
    console.log("server ready");
  });
