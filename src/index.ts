import { GraphQLServer } from "graphql-yoga";
import { validateJWT } from "./auth";
import { resolvers, typeDefs } from "./resources/main";

const makePublic = async (resolve, parent, args, context, info) => {
  context.request.isPublic = true;
  return resolve();
};

const publicRoutesMiddleware = {
  Query: {
    confirmSignupGoogle: makePublic,
    googleUri: makePublic,
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
  context: req => ({ ...req }),
  middlewares: [publicRoutesMiddleware, authMiddleware],
  resolvers,
  typeDefs,
});

server
  .start({
    port: 4000,
  })
  .then(() => {
    console.log("server ready");
  });
