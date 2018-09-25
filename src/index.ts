import { GraphQLServer } from "graphql-yoga";
import { prisma } from "../generated/prisma";

// import { passport } from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";

/*passport.use(
  new GoogleStrategy(
    {
      callbackURL: "https://api.synapse.now.sh/auth/google/callback",
      clientID:
        "850899037915-mntha2odh9sfftht3qp11ifo9nio6hit.apps.googleusercontent.com",
      clientSecret: "jebZ-wZ92SIdNVwGbhgSGRRh",
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOrCreate({ googleId: profile.id }, (err, user) => {
        return cb(err, user);
      });
    },
  ),
);*/

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    users: async (root, args, context) => {
      const users = await prisma.users();
      return users.map((user): string => user.name);
    },
  },
};

const typeDefs = `
  type Query {
    users: [String]
  }
`;

const server = new GraphQLServer({
  resolvers,
  typeDefs,
});

server.express.get("/auth/connect");

server.start().then(() => {
  console.log("server ready");
});
