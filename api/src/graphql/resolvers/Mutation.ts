import { rule, or } from "graphql-shield";

import {
  prisma,
  Course,
  CourseUser,
  ContentPieceUpdateInput,
} from "../../../generated/prisma";
import { IntResolverContext } from "../../graphqlContext";
import {
  isSystemAdmin,
  isCourseAdminFromId,
  isCourseProfessorFromId,
  isCourseAssistantFromId,
  hasCourseFromId,
} from "../rules";

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
      const course = await prisma.course({ id: args.course_id });
      const data: any = {};
      if (args.name && args.name.length > 1) {
        data.name = args.name;
      }
      if (args.description && args.description.length > 1) {
        data.description = args.description;
      }
      return prisma.updateCourse({
        data,
        where: { id: args.course_id },
      });
    },
    // you can edit the course if you are a professor or admin in the course
    // or it you are global admin
    shield: or(isSystemAdmin, isCourseAdminFromId, isCourseProfessorFromId),
  },
  deleteCourse: {
    resolver: async (root, args, context) => {
      return prisma.deleteCourse({ id: args.course_id });
    },
    // You can delete the course if you are a system admin
    // or an admin in that course
    shield: or(isSystemAdmin, isCourseAdminFromId),
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
    // you can add a user to a course if you are a system admin
    // or an admin or professor in that course
    shield: or(isSystemAdmin, isCourseProfessorFromId, isCourseAdminFromId),
  },
  removeUserFromCourse: {
    resolver: async (root, args, context): Promise<Course> => {
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
    /*
    To remove a user from a course you must either be system admin
    or have greater "rank" than them.
    So admins can remove everyone but professors can only remove students, assistants, and auditors
    */
    shield: or(
      isSystemAdmin,
      rule()(async (root, args, context) => {
        const adminsRoles = await prisma
          .course({ id: args.course_id })
          .userRoles({
            where: {
              user: {
                id: context.id,
              },
            },
          });
        const victimsRoles = await prisma
          .course({ id: args.course_id })
          .userRoles({
            where: {
              user: {
                id: args.user_id,
              },
            },
          });
        if (adminsRoles.length !== 1 || victimsRoles.length !== 1) {
          throw new Error("wrong number of roles found");
        }
        const [admin] = adminsRoles;
        const [victim] = victimsRoles;
        if (admin.user_type === "ADMIN") {
          return true;
        }
        if (
          admin.user_type === "PROFESSOR" &&
          victim.user_type !== "PROFESSOR" &&
          victim.user_type !== "ADMIN"
        ) {
          return true;
        }
        return false;
      }),
    ),
  },
  changeUserRoleInCourse: {
    resolver: async (root, args) => {
      const { user_id, new_role, course_id } = args;
      const role = await prisma.course({ id: course_id }).userRoles({
        where: {
          user: {
            id: user_id,
          },
        },
      })[0];
      return prisma.updateCourseUser({
        data: {
          user_type: new_role,
        },
        where: { id: role.id },
      });
    }, // TODO: improve these rules. They allow professor to bypass permissions checks
    // A user can change another members role if they are admin or professor
    shield: or(isSystemAdmin, isCourseAdminFromId, isCourseProfessorFromId),
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
      return prisma.updateCourse({
        data: {
          description: newDesc,
        },
        where: {
          id: course_id,
        },
      });
    }, // you must be course admin or course professor to update the description
    shield: or(isSystemAdmin, isCourseAdminFromId, isCourseProfessorFromId),
  },
  readNotification: {
    resolver: async (root, args, context) => {
      return prisma.updateMessageRead({
        data: { read: true },
        where: { id: args.note_read_id },
      });
    },
    // The notification must belong to the user for them to delete it
    shield: rule()(async (root, args, context) => {
      const user = await prisma.messageRead({ id: args.note_read_id }).user();
      return user.id === context.id;
    }),
  },
  readAllNotifications: {
    resolver: async (root, args, context) => {
      // No shield necessary because we filter for only MessageReads the user owns
      const res = await prisma.updateManyMessageReads({
        where: { user: { id: context.id } },
        data: { read: true },
      });
      return { count: res.count };
    },
  },
  createCourseMessage: {
    resolver: async (root, args, context) => {
      // TODO: implement this.
      /*return prisma.createCourseMessage({
        body: args.body,
        course: args.course_id,
      });*/
    },
    shield: or(
      isCourseAdminFromId,
      isCourseProfessorFromId,
      isCourseAssistantFromId,
    ),
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
    shield: hasCourseFromId,
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
    shield: or(
      // You can update content if:
      // 1. you're a system or course admin
      // 2. you created the context originally
      // 3. you're a professor or assistant in the course
      isSystemAdmin,
      rule()(async (root, args, context) => {
        const { id } = args;
        const creator = await prisma.contentPiece({ id }).creator();
        return creator.id === context.id;
      }),
      rule()(async (root, args, context) => {
        const { id: courseId } = await prisma
          .contentPiece({ id: args.id })
          .course();
        const roles = await prisma.course({ id: courseId }).userRoles({
          where: {
            user: {
              id: context.id,
            },
          },
        });
        if (
          roles.length === 1 &&
          (roles[0].user_type === "PROFESSOR" ||
            roles[0].user_type === "ADMIN" ||
            roles[0].user_type === "ASSISTANT")
        ) {
          return true;
        }
        return false;
      }),
    ),
  },
  deleteCourseContent: {
    resolver: async (root, args, content) => {
      // TODO check for permissions...
      const { id } = args;
      return prisma.deleteContentPiece({ id });
    },
    shield: or(
      rule()(async (root, args, context) => {
        const { id } = args;
        const creator = await prisma.contentPiece({ id }).creator();
        return creator.id === context.id;
      }),
      rule()(async (root, args, context) => {
        const { id } = args;
        const course = await prisma.contentPiece({ id }).course();
        const role: CourseUser = await prisma
          .user({ id: context.id })
          .courseRoles({
            where: {
              course: {
                id: course.id,
              },
            },
          })[0];
        return role.user_type === "ADMIN" || role.user_type === "PROFESSOR";
      }),
      isSystemAdmin,
    ),
  },
};
