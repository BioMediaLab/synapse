import configCheck from "./config";
configCheck(); // Make sure that the config we're reading from the .env is sane.

import * as express from "express";
import * as fs from "fs";
import { ApolloServer, gql } from "apollo-server-express";
import { prisma } from "./generated/prisma-client";
import { schema } from "./schema";
import googleAuthRouter from "./routes/auth/google";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "./permissions";

const PORT = 4000;

const app = express();

app.use("/auth/google", googleAuthRouter);

const schemaWithMiddlware = applyMiddleware(schema, permissions);

const server = new ApolloServer({
  schema: schemaWithMiddlware,
  context: { prisma },
});

server.applyMiddleware({ app });

app.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
