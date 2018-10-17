import * as dotenv from "dotenv";
import { GraphQLServer } from "graphql-yoga";

import { validateJWT } from "./auth";
import db from "./db";
import { resolvers } from "./graphql/main";
import googleAuthRouter from "./routes/auth/google";

dotenv.config({ path: ".env" });

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
  const jwt: string = context.request.get("authorization");
  const me = await validateJWT(jwt);
  if (!me.isValid) {
    throw new Error("unauthorized");
  }
  context.id = me.uid;
  return resolve();
};

const server = new GraphQLServer({
  context: (req) => ({ ...req, db }),
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
