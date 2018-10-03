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
      const photo: string = me.image.url;
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
          photo,
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
        email,
        name,
        photo,
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
      return prisma.user({ id: args.id });
    },
    me: async (root, args, context) => {
      return prisma.user({ id: context.id });
    },
    users: async (root, args, context): Promise<string[]> => {
      const users = await prisma.users();
      return users.map((user): string => user.name);
    },
  },
  Mutation: {
    promoteUser: async (root, args, context) => {
      const me = await prisma.user({ id: context.id });
      if (!me.isAdmin) {
        throw new Error("not authorized to create courses");
      }
      return prisma.updateUser({
        data: {
          isAdmin: args.admin,
        },
        where: {
          id: args.id,
        }
      })
    },
    deleteUser: async (root, args, context) => {
      const me = await prisma.user({ id: context.id });
      if (!me.isAdmin) {
        throw new Error("not authorized to create courses");
      }
      return prisma.deleteUser({ id: args.id });
    },
    createCourse: async (root, args, context) => {
      const me = await prisma.user({ id: context.id });
      if (!me.isAdmin) {
        throw new Error("not authorized to create courses");
      }
      const { name } = args;
      return prisma.createCourse({
        name, description: args.description
      });
    },
    editCourse: async (root, args, context) => {
      const me = await prisma.user({ id: context.id });
      if (!me.isAdmin) {
        throw new Error("not authorized to update courses");
      }
      return prisma.updateCourse({
        data: { name: args.name, description: args.description },
        where: { id: args.id }
      });
    },
    deleteCourse: async (root, args, context) => {
      const me = await prisma.user({ id: context.id });
      if (!me.isAdmin) {
        throw new Error("not authorized to delete courses");
      }
      return prisma.deleteCourse({ id: args.id });
    },
    addUsersToCourse: async (root, args, context) => {
      const me = await prisma.user({ id: context.id });
      if (!me.isAdmin) {
        throw new Error("not authorized to update courses");
      }
      const { course_id: courseId } = args;
      const newUsers = args.user_ids ? args.user_ids : [];
      return prisma.updateCourse({
        data: {
          users: {
            connect: [
              ...newUsers.map(id => ({ id }))
            ]

          },
        },
        where: {
          id: courseId,
        }
      });
    },
  }
};
