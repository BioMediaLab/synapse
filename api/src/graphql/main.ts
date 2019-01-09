import { forwardTo } from "prisma-binding";

import { Notification, prisma } from "../../generated/prisma";
import { IntResolverContext } from "../graphqlContext";
import { IResolvers } from "graphql-tools";
import {
  Course,
  CourseUser,
  User,
  ContentPieceUpdateInput,
} from "../../generated/prisma/index";

// A map of functions which return data for the schema.
export const resolvers: IResolvers = {
  Query: {
    myCourseRoles: async (root, args, context): Promise<CourseUser[]> => {
      const roles = await prisma.user({ id: context.id }).courseRoles();
      return roles;
    },
    course: forwardTo("bindingDb") as any, // todo: perm check
    user: forwardTo("bindingDb") as any,
    me: async (root, args, context): Promise<User> => {
      return prisma.user({ id: context.id });
    },
    userSearch: async (root, args, context): Promise<User[]> => {
      const { name, email } = args;
      const first = 10;
      // Only search for users from a certain course
      if (args.course_id) {
        return prisma.users({
          where: {
            AND: [
              { OR: [{ name_contains: name }, { email_contains: email }] },
              {
                courseRoles_some: {
                  course: {
                    id: args.course_id,
                  },
                },
              },
            ],
          },
          orderBy: "name_ASC",
          first,
        });
      }

      // we don't need to worry what course they're in
      return prisma.users({
        where: {
          OR: [{ name_contains: name }, { email_contains: email }],
        },
        orderBy: "name_ASC",
        first,
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
    userRoles: async (root): Promise<CourseUser> => {
      return prisma.course({ id: root.id }).userRoles();
    },
    files: async (root, args, context) => {
      return prisma.course({ id: root.id }).files();
    },
  },
  CourseUser: {
    course: async ({ id }): Promise<Course> => {
      return prisma.courseUser({ id }).course();
    },
    user: async ({ id }): Promise<User> => {
      return prisma.courseUser({ id }).user();
    },
  },
  User: {
    courseRoles: async ({ id }): Promise<CourseUser> => {
      return prisma.user({ id }).courseRoles();
    },
  },
  ContentPiece: {
    creator: async (root, args, context) => {
      return prisma.contentPiece({ id: root.id }).creator();
    },
  },
  Notification: {
    target: async (root, args) => {
      return prisma.notification({ id: root.id }).target();
    },
  },
  Mutation: {
    // turns a regular user into a system admin
    promoteUser: async (root, args, context: IntResolverContext) => {
      // TODO: permissions check
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
      // TODO: permissions check
      return prisma.deleteUser({ id: args.id });
    },
    createCourse: async (root, args, context) => {
      // todo: permissions check
      const { name } = args;
      return prisma.createCourse({
        name,
        description: args.description,
      });
    },
    editCourse: async (root, args, context) => {
      // todo: permissions stuff here
      return prisma.updateCourse({
        data: { name: args.name, description: args.description },
        where: { id: args.id },
      });
    },
    deleteCourse: async (root, args, context) => {
      // TODO: move this to permissions layer
      return prisma.deleteCourse({ id: args.id });
    },
    addUsersToCourse: async (root, args, context) => {
      // TODO: permissions here
      const { course_id: courseId } = args;
      const newUsers = args.users ? args.users : [];
      return prisma.updateCourse({
        data: {
          userRoles: {
            create: newUsers.map(({ user_id, role }) => ({
              user_type: role,
              user: {
                connect: {
                  id: user_id,
                },
              },
            })),
          },
        },
        where: {
          id: courseId,
        },
      });
    },
    removeUserFromCourse: async (root, args, context): Promise<Course> => {
      // TODO permissions check
      const roles = await prisma.user({ id: args.user_id }).courseRoles({
        where: {
          course: {
            id: args.course_id,
          },
        },
      });

      if (roles.length === 0) {
        throw new Error(
          `Attempted to remove user ${args.user_id} from course ${
            args.course_id
          } but they were not in the course to begin with.`,
        );
      }

      return prisma.updateCourse({
        data: {
          userRoles: {
            deleteMany: roles.map(role => ({ id: role.id })),
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
    createContent: async (root, args, context) => {
      const { name, type, url, course_id, description } = args;
      const cleanDescription = description ? description : "";
      return prisma.createContentPiece({
        name,
        type,
        url,
        description: cleanDescription,
        forUnits: true,
        creator: {
          connect: {
            id: context.id,
          },
        },
        course: {
          connect: {
            id: course_id,
          },
        },
      });
    },
    updateContentMetadata: async (root, args, content) => {
      // TODO check for permissions...
      const { id, name: pName, description: pDesc } = args;
      const data: ContentPieceUpdateInput = {};
      if (pName) {
        data.name = pName;
      }
      if (pDesc) {
        data.description = pDesc;
      }
      return prisma.updateContentPiece({ where: { id }, data });
    },
    deleteCourseContent: async (root, args, content) => {
      // TODO check for permissions...
      const { id } = args;
      return prisma.deleteContentPiece({ id });
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
