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
      const total = 10;
      const where = {
        target: {
          reads_some: {
            AND: [{ user: { id: context.id } }, { read }],
          },
        },
      };
      const { count } = await prisma
        .notificationsConnection({
          where,
        })
        .aggregate();

      const notificationNodes = await prisma.notifications({
        where,
        orderBy: "createdAt_DESC", // order by date created, starting at the newest date
      });

      const noteFetchers = notificationNodes.map(async node => {
        const reads = await prisma
          .notification({ id: node.id })
          .target()
          .reads({
            where: {
              user: {
                id: context.id,
              },
            },
          });
        const readRecordId = reads[0].id;
        return {
          readRecordId,
          notification: node,
          read,
        };
      });
      const notificationRecords = await Promise.all(noteFetchers);

      return {
        total: count,
        notificationRecords,
      };
    },
    reminders: async (root, args, context) => {
      return prisma.reminders({
        where: {
          AND: [
            {
              target: {
                users_some: {
                  id: context.id,
                },
              },
            },
            { triggerTime_lt: new Date() },
          ],
        },
        orderBy: "triggerTime_ASC",
      });
    },
  },
  Course: {
    users: async (root, args, context) => {
      return prisma.course({ id: root.id }).users(args);
    },
  },
  Notification: {
    target: async (root, args) => {
      return prisma.notification({ id: root.id }).target();
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
      return prisma.updateMessageRead({
        data: { read: true },
        where: { id: args.note_read_id },
      });
    },
    readAllNotifications: async (root, args, context) => {
      const res = await prisma.updateManyMessageReads({
        where: { user: { id: context.id } },
        data: { read: true },
      });
      return { count: res.count };
    },
    createCourseMessage: async (root, args, context) => {
      return prisma.createCourseMessage({
        body: args.body,
        course: args.course_id,
      });
    },
    // TODO: add support for sending reminders to entire courses
    createReminder: async (root, args, context) => {
      const { msg, triggerTime } = args;
      const triggerTimeAsDate = new Date(triggerTime);
      return prisma.createReminder({
        msg,
        triggerTime: triggerTimeAsDate,
        target: {
          create: {
            type: "USER",
            users: {
              connect: {
                id: context.id,
              },
            },
          },
        },
      });
    },
    deleteReminder: async (root, args, context) => {
      const { id } = args;
      return prisma.deleteReminder({ id });
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
            AND: [
              { mutation_in: "CREATED" },
              {
                node: {
                  target: {
                    reads_some: {
                      user: { id },
                    },
                  },
                },
              },
            ],
          })
          .node();
      },
      resolve: async (data: Notification, args, context) => {
        const readRecord = (await prisma
          .notification({ id: data.id })
          .target()
          .reads({
            where: {
              user: {
                id: context.id,
              },
            },
          }))[0];
        return {
          notification: data,
          read: false,
          readRecordId: readRecord.id,
        };
      },
    },
  },
};
