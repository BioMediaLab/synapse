import { google } from "googleapis";
import { forwardTo } from "prisma-binding";

import { Notification, prisma, UserNode } from "../../generated/prisma";
import { createJWT } from "../auth";
import googleConfig from "../config/google";
import { IntResolverContext } from "../graphqlContext";
import { IResolvers } from "graphql-tools";

const getGoogleApiClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    googleConfig.appId,
    googleConfig.appSecret,
    googleConfig.appRedirect,
  );
  google.options({ auth: oauth2Client });
  return oauth2Client;
};

interface IntConfirmSignup {
  jwt: string;
  firstLogin: boolean;
}

// A map of functions which return data for the schema.
export const resolvers: IResolvers = {
  Query: {
    confirmSignupGoogle: async (_, args): Promise<IntConfirmSignup> => {
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
    course: forwardTo("bindingDb") as any,
    user: async (root, args) => {
      return prisma.user({ id: args.id });
    },
    me: async (root, args, context): Promise<UserNode> => {
      return prisma.user({ id: context.id });
    },
    users: async (root, args, context): Promise<string[]> => {
      const users = await prisma.users();
      return users.map((user): string => user.name);
    },
    userSearch: async (root, args, context): Promise<any[]> => {
      const { name, email } = args;
      if (!args.course_id) {
        return prisma.users({
          where: {
            OR: [{ name_contains: name }, { email_contains: email }],
          },
          orderBy: "name_ASC",
          first: 30,
        });
      }
      return prisma.course({ id: args.course_id }).users({
        where: {
          OR: [{ name_contains: name }, { email_contains: email }],
        },
        orderBy: "name_ASC",
        first: 30,
      });
    },
    recentNotifications: async (root, args, context) => {
      const { start } = args;
      const startAt = start ? start : 0;
      const total = await prisma
        .notificationsConnection({
          where: {
            user: { id: context.id },
          },
          orderBy: "createdAt_DESC",
        })
        .aggregate()
        .count();
      const notes = await prisma.notifications({
        where: {
          user: { id: context.id },
        },
        orderBy: "createdAt_DESC",
        skip: startAt,
        last: startAt + 10,
      });
      return {
        total,
        notes,
      };
    },
  },
  Mutation: {
    promoteUser: async (root, args, context: IntResolverContext) => {
      const me = await prisma.user({ id: context.id });
      if (!me.isAdmin) {
        throw new Error("not authorized to change user's admin status");
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
    removeUsersFromCourse: async (root, args, context) => {
      const me = await prisma.user({ id: context.id });
      if (!me.isAdmin) {
        throw new Error("not authorized to update courses");
      }
      return prisma.updateCourse({
        data: {
          users: {
            disconnect: [...args.user_ids.map(id => ({ id }))],
          },
        },
        where: {
          id: args.course_id,
        },
      });
    },
  },
  Subscription: {
    notification: {
      subscribe: async (
        root,
        args,
        context: IntResolverContext,
        info,
      ): Promise<AsyncIterator<Notification>> => {
        const { db, id } = context;
        return db.$subscribe
          .notification({
            where: {
              AND: [
                { mutation_in: ["CREATED"] }, // the notification was just created, rather than updated or deleted
                {
                  node: {
                    user: {
                      id, // filter for notifications where the user has the current id
                    },
                  },
                },
              ],
            }, // typescript seems to be broken here 😠
          } as any)
          .node();
      }, // for some reason we need to explicitely return the data here
      resolve: data => {
        return data;
      },
    },
  },
};
