import * as path from "path";
import * as allTypes from "./resolvers";
import datamodelInfo from "./generated/nexus-prisma.ts";
import { prisma } from "./generated/prisma-client";
import { makePrismaSchema } from "nexus-prisma";

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */

export const schema = makePrismaSchema({
  types: allTypes,

  prisma: {
    datamodelInfo,
    client: prisma,
  },

  outputs: {
    schema: path.join(__dirname, "./generated/schema.graphql"),
    typegen: path.join(__dirname, "./generated/nexus.ts"),
  },

  nonNullDefaults: {
    input: true,
    output: true,
  },

  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, "./generated/prisma-client/index.ts"),
        alias: "prisma",
      },
      {
        source: path.join(__dirname, "./context.ts"),
        alias: "ctx",
      },
    ],
    contextType: "ctx.Context",
  },
});
