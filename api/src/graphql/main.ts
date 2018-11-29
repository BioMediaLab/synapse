import { forwardTo } from "prisma-binding";

import { Notification, prisma, User } from "../../generated/prisma";
import { IntResolverContext } from "../graphqlContext";
import { IResolvers } from "graphql-tools";
import { COPYFILE_EXCL } from "constants";

// A map of functions which return data for the schema.
export const resolvers: IResolvers = {
  Query: {
    courses: async (root, args, context): Promise<any[]> => {
      const courses = await prisma.user({ id: context.id }).courses();
      if (!courses) {
        return [];
      }
      return courses;
    },
    course: forwardTo("bindingDb"),
    user: async (root, args) => {
      return prisma.user({ id: args.id });
    },
    me: async (root, args, context): Promise<User> => {
      return prisma.user({ id: context.id });
    },
    users: async (root, args, context): Promise<string[]> => {
      const users = await prisma.users();
      return users.map((user): string => user.name);
    },
    userSearch: async (root, args, context): Promise<any[]> => {
      const { name, email } = args;
      const first = 10;
      if (!args.course_id && !args.filter_course_id) {
        return prisma.users({
          where: {
            OR: [{ name_contains: name }, { email_contains: email }],
          },
          orderBy: "name_ASC",
          first,
        });
      }
      if (args.course_id && !args.filter_course_id) {
        return prisma.course({ id: args.course_id }).users({
          where: {
            OR: [{ name_contains: name }, { email_contains: email }],
          },
          orderBy: "name_ASC",
          first,
        });
      }
      return prisma.users({
        where: {
          AND: [
            { OR: [{ name_contains: name }, { email_contains: email }] },
            { courses_none: args.filter_course_id },
          ],
        },
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
  Course: {
    users: async (root, args, context) => {
      return prisma.course({ id: root.id }).users(args);
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
    updateUser: async (root, args, context) => {
      // const updates = { ...args };
      // delete updates.id;
      return prisma.updateUser({
        data: {
          name: args.name,
          bio: args.bio,
          iClickerID: args.iClicker,
          email: args.email,
        },
        where: {
          id: args.id,
        },
      });
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
    updateCourseDescription: async (root, args, context) => {
      let newDesc = "";
      const { description, course_id } = args;
      if (description) {
        newDesc = description;
      }
      if (!course_id) {
        throw new Error("no course id found");
      }
      // TODO: check for permissions here!
      return prisma.updateCourse({
        data: {
          description: newDesc,
        },
        where: {
          id: course_id,
        },
      });
    },
    readNotification: async (root, args, context) => {
      return prisma.updateNotification({
        data: { read: true },
        where: { id: args.note_id },
      });
    },
    createCourseMessage: async (root, args, context) => {
      return prisma.createCourseMessage({
        body: args.body,
        course: args.course_id,
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
