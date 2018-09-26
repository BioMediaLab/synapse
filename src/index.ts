import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
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

const getGoogleApiClient = (): OAuth2Client => {
    const oauth2Client = new google.auth.OAuth2(
        "224734824930-79g0hpfj9fvdatefrp32sj0cj49qbign.apps.googleusercontent.com",
        "CESTwV2H9hMfP_nd5pv698Zj",
        "http://localhost:3000/auth/google",
    );
    google.options({ auth: oauth2Client });
    return oauth2Client;
};

// A map of functions which return data for the schema.
const resolvers = {
    Query: {
        confirmSignupGoogle: async (_, args): Promise<any> => {
            const oauth2Client = getGoogleApiClient();
            const { tokens } = await oauth2Client.getToken(args.token);
            oauth2Client.setCredentials(tokens);
            const plusClient = google.plus({
                version: "v1",
            });
            const me = await plusClient.people.get({
                userId: "me",
            });
            console.log(me);
            return {
                firstLogin: true,
                jwt: "test2",
                uid: "test",
            };
        },
        courses: async (root, args, context): Promise<any[]> => {
            const courses = await prisma.courses();
            return courses;
        },
        googleUri: async (_, args): Promise<string> => {
            if (!args.email.includes("maine.edu")) {
                throw new Error("maine only!");
            }
            const oauth2Client = getGoogleApiClient();
            const scopes = [
                "https://www.googleapis.com/auth/plus.me",
                "https://www.googleapis.com/auth/userinfo.email",
            ];
            const url = oauth2Client.generateAuthUrl({
                // 'online' (default) or 'offline' (gets refresh_token)
                access_type: "online",

                scope: scopes,
            });

            return url;
        },
        users: async (root, args, context): Promise<string[]> => {
            const users = await prisma.users();
            return users.map((user): string => user.name);
        },
    },
};

const typeDefs = `
  scalar DateTime

  type Query {
    users: [String],
    googleUri(email: String!): String!,
    confirmSignupGoogle(token: String!): Session!,
    courses: [Course]!
  }

  type Session {
    firstLogin: Boolean,
    uid: String!,
    jwt: String!,
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
    typeDefs,
});

server.express.get("/auth/connect");

server.start().then(() => {
    console.log("server ready");
});
