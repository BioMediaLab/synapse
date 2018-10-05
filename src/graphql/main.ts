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

interface ConfirmSignup {
  jwt: string;
  firstLogin: boolean;
}

// A map of functions which return data for the schema.
export const resolvers = {
  Query: {
    confirmSignupGoogle: async (_, args): Promise<ConfirmSignup> => {
      const oauth2Client = getGoogleApiClient();
      const { tokens } = await oauth2Client.getToken(args.token);
      oauth2Client.setCredentials(tokens);

      const { data } = await google
        .oauth2({
          version: "v2",
        })
        .userinfo.get();

      const email: string = data.email;
      const name: string = data.name;
      const photo = data.picture;

      // does the user already have an account?
      let account = await prisma.user({ email });

      let firstLogin = false;
      if (!account) {
        // create a new account
        account = await prisma.createUser({
          email,
          name,
          photo,
        });
        firstLogin = true;
      }

      const jwt = await createJWT({
        id: account.id,
        name: account.name,
        email: account.email,
        photo: account.photo,
        isAdmin: account.isAdmin,
      });

      return {
        firstLogin,
        jwt,
      };
    },
    courses: async (root, args, context): Promise<any[]> => {
      const courses = await prisma.user({ id: context.id }).courses();
      if (!courses) {
        return [];
      }
      return courses;
    },
    course: async (root, args, context) => {
      const courses = await prisma.user({ id: context.id })
        .courses({ where: { id: args.id } });
      if (courses.length !== 1) {
        throw new Error("user is not a member of the course");
      }
      return courses[0];
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
        },
      });
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
        name,
        description: args.description,
      });
    },
    editCourse: async (root, args, context) => {
      const me = await prisma.user({ id: context.id });
      if (!me.isAdmin) {
        throw new Error("not authorized to update courses");
      }
      return prisma.updateCourse({
        data: { name: args.name, description: args.description },
        where: { id: args.id },
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
            connect: [...newUsers.map(id => ({ id }))],
          },
        },
        where: {
          id: courseId,
        },
      });
    },
  },
};
