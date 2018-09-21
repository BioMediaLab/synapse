import { ApolloServer, gql } from "apollo-server";
import { prisma } from "../generated/prisma";

const main = async () => {
  const allUsers = await prisma.users();
  console.log(allUsers);
};

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    users: async (root, args, context) => {
      const users = await prisma.users();
      return users.map((user): string => user.name);
    },
  },
};

const typeDefs = gql`
  type Query {
    users: [String]
  }
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
