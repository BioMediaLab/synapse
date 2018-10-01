import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

import { prisma } from "../../generated/prisma";
import { createJWT } from "../auth";
import googleConfig from "../config/google";

const getGoogleApiClient = (): OAuth2Client => {
  const oauth2Client = new google.auth.OAuth2(
    googleConfig.appId,
    googleConfig.appSecret,
    googleConfig.appRedirect,
  );
  google.options({ auth: oauth2Client });
  return oauth2Client;
};

// A map of functions which return data for the schema.
export const resolvers = {
  Query: {
    confirmSignupGoogle: async (_, args): Promise<any> => {
      const oauth2Client = getGoogleApiClient();
      const { tokens } = await oauth2Client.getToken(args.token);
      oauth2Client.setCredentials(tokens);
      const plusClient = google.plus({
        version: "v1",
      });

      // fetch the data from Google Plus API
      const { data: me } = await plusClient.people.get({
        userId: "me",
      });
      const email: string = me.emails[0].value;
      const name: string = me.displayName;
      const nickname = me.nickname;

      // does the user already have an account?
      const accounts = await prisma.users({ where: { email } });

      let firstLogin = true;
      let id: string;
      if (accounts.length === 0) {
        // create a new account
        const newUser = await prisma.createUser({
          email,
          name,
          nickname,
        });
        id = newUser.id;
      } else if (accounts.length === 1) {
        // retrieve an existing account
        const [account] = accounts;
        firstLogin = false;
        id = account.id;
      } else {
        throw new Error("deplucate email");
      }

      const jwt = await createJWT(id);
      return {
        firstLogin,
        id,
        jwt,
      };
    },
    courses: async (root, args, context): Promise<any[]> => {
      return prisma.user({ id: context.id }).courses();
    },
    googleUri: async (_, args): Promise<string> => {
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
    user: async (root, args) => {
      return await prisma.user({ id: args.id });
    },
    users: async (root, args, context): Promise<string[]> => {
      const users = await prisma.users();
      return users.map((user): string => user.name);
    },
  },
};

export const typeDefs = `
  scalar DateTime

  type Query {
    users: [String],
    user(id: String!): User,
    googleUri(email: String!): String!,
    confirmSignupGoogle(token: String!): Session!,
    courses: [Course]!
  }

  type Session {
    firstLogin: Boolean,
    id: String!,
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
