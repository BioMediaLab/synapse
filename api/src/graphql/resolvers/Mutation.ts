import { IntResolverContext } from "../../graphqlContext";
import { isSystemAdmin, emptyRule } from "../rules";
import {
  prisma,
  Course,
  ContentPieceUpdateInput,
} from "../../../generated/prisma";
import { rule } from "graphql-shield";

export const Mutation = {
  // turns a regular user into a system admin
  promoteUser: {
    resolver: async (root, args, context: IntResolverContext) => {
      return prisma.updateUser({
        data: {
          isAdmin: args.admin,
        },
        where: {
          id: args.id,
        },
      });
    },
    shield: isSystemAdmin,
  },
  deleteUser: {
    resolver: async (root, args, context) => {
      return prisma.deleteUser({ id: args.id });
    },
    shield: isSystemAdmin,
  },
  createCourse: {
    resolver: async (root, args, context) => {
      const { name } = args;
      return prisma.createCourse({
        name,
        description: args.description,
      });
    },
    shield: isSystemAdmin,
  },
  editCourse: {
    resolver: async (root, args, context) => {
      // todo: permissions stuff here
      return prisma.updateCourse({
        data: { name: args.name, description: args.description },
        where: { id: args.id },
      });
    },
    shield: emptyRule,
  },
  deleteCourse: {
    resolver: async (root, args, context) => {
      // TODO: move this to permissions layer
      return prisma.deleteCourse({ id: args.id });
    },
    shield: emptyRule,
  },
  addUsersToCourse: {
    resolver: async (root, args, context) => {
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
  },
  removeUserFromCourse: {
    resolver: async (root, args, context): Promise<Course> => {
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
  },
  updateCourseDescription: {
    resolver: async (root, args, context) => {
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
  },
  readNotification: {
    resolver: async (root, args, context) => {
      return prisma.updateMessageRead({
        data: { read: true },
        where: { id: args.note_read_id },
      });
    },
  },
  readAllNotifications: {
    resolver: async (root, args, context) => {
      const res = await prisma.updateManyMessageReads({
        where: { user: { id: context.id } },
        data: { read: true },
      });
      return { count: res.count };
    },
  },
  createCourseMessage: {
    resolver: async (root, args, context) => {
      return prisma.createCourseMessage({
        body: args.body,
        course: args.course_id,
      });
    },
  },
  // TODO: add support for sending reminders to entire courses
  createReminder: {
    resolver: async (root, args, context) => {
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
  },
  deleteReminder: {
    resolver: async (root, args, context) => {
      const { id } = args;
      return prisma.deleteReminder({ id });
    },
  },
  createContent: {
    resolver: async (root, args, context) => {
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
  },
  updateContentMetadata: {
    resolver: async (root, args, content) => {
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
  },
  deleteCourseContent: {
    resolver: async (root, args, content) => {
      // TODO check for permissions...
      const { id } = args;
      return prisma.deleteContentPiece({ id });
    },
    shield: rule()(async (root, args, context) => {
      const { id } = args;
      const creator = await prisma.contentPiece({ id }).creator();
      return creator.id === context.id;
    }),
  },
};
