import { google } from "googleapis";
import { GraphQLServer } from "graphql-yoga";
import { prisma, Course } from "../generated/prisma";

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
    signupGoogle: async (_, args): Promise<string> => {
      if (!args.email.includes("maine.edu")) {
        throw new Error("maine only!");
      }
      const oauth2Client = new google.auth.OAuth2(
        "850899037915-mntha2odh9sfftht3qp11ifo9nio6hit.apps.googleusercontent.com",
        "jebZ-wZ92SIdNVwGbhgSGRRh",
        "http://localhost:3000/auth/google"
      );

      const scopes = ["https://www.googleapis.com/auth/plus.me"];

      const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: "online",

        // If you only need one scope you can pass it as a string
        scope: scopes
      });

      return url;
    },
    users: async (root, args, context): Promise<string[]> => {
      const users = await prisma.users();
      return users.map((user): string => user.name);
    },
    courses: async (root, args, context): Promise<any[]> => {
      const courses = await prisma.courses();
      return courses;
    }
  }
};

const typeDefs = `
  scalar DateTime

  type Session {
    firstLogin: Boolean,
    uid: String,
  }

  type Query {
    users: [String],
    signupGoogle(email: String!): String!,
    confirmSignupGoogle(token: String!): Session!,
    courses: [Course]!
  }

  type User {
    id: ID! @unique
    courses: [Course!]!
    student_id: Int @unique
    name: String!
    nickname: String
    email: String! @unique
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Course {
    id: ID! @unique
    users: [User!]!
    name: String!
    description: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;

const server = new GraphQLServer({
  resolvers,
  typeDefs
});

server.express.get("/auth/connect");

server.start().then(() => {
  console.log("server ready");
});
