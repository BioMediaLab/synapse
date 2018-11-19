import { google } from "googleapis";
import { forwardTo } from "prisma-binding";

import { Notification, prisma, User } from "../../generated/prisma";
import { IntResolverContext } from "../graphqlContext";
import { IResolvers } from "graphql-tools";

// A map of functions which return data for the schema.
export const resolvers: IResolvers = {
  Query: {
    courses: async (root, args, context): Promise<any[]> => {
      const courses = await prisma.user({ id: context.id }).courses();
      if (!courses) {
        return [];
      }
      console.log("This is course context id: ", context.id);
      return courses;
    },
    course: forwardTo("bindingDb") as any,
    user: forwardTo("bindingDb") as any,
    /*
    user: async (root, args, context) => {
      const user = await prisma.user({ id: args.id });
      console.log("This is user args id: ", args.id);
      console.log("This is user context id: ", context.id);
      return user;
    },*/
    me: async (root, args, context): Promise<User> => {
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
          first: 10,
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
      const read = args.read ? args.read : false;
      const startAt = args.start ? args.start : 0;
      const where = {
        AND: [{ user: { id: context.id } }, { read }],
      };

      const total = await prisma
        .notificationsConnection({
          where,
        })
        .aggregate().count;
      const notifications = await prisma.notifications({
        where,
        orderBy: "createdAt_ASC",
        skip: startAt,
        last: startAt + 10,
      });
      prisma.updateManyNotifications({
        data: { read: true },
        where: {
          AND: [...notifications.map(notif => ({ id: notif.id }))],
        },
      });
      return {
        total,
        notifications,
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
    readNotification: async (root, args, context) => {
      return prisma.updateNotification({
        data: { read: true },
        where: { id: args.note_id },
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
