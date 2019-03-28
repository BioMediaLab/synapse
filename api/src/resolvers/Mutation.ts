import { mutationType, idArg, stringArg, booleanArg, arg } from "nexus";
import { Course, User, CourseUser, CourseUserAndRole } from ".";

export const Mutation = mutationType({
  definition(t) {
    t.field("removeUserFromCourse", {
      type: CourseUser,
      args: {
        course_id: idArg(),
        user_id: idArg(),
      },
      resolve: async (_, args, context) => {
        const courseUser = await context.prisma.courseUsers({
          where: {
            AND: [
              {
                user: {
                  id: args.user_id,
                },
              },
              {
                course: {
                  id: args.course_id,
                },
              },
            ],
          },
        });

        return context.prisma.deleteCourseUser({ id: courseUser[0].id });
      },
    });

    t.field("promoteUser", {
      type: User,
      args: {
        user_id: idArg(),
        admin: booleanArg({ nullable: true }),
      },
      resolve: async (_, args, context) => {
        const isAdmin = args.admin ? true : false;
        return context.prisma.updateUser({
          data: {
            isAdmin,
          },
          where: {
            id: args.user_id,
          },
        });
      },
    });

    t.field("createCourse", {
      type: Course,
      args: {
        name: stringArg(),
        description: stringArg(),
        parent_id: stringArg({ required: false }),
      },
      resolve: async (_, args, context) => {
        const parentInfo = args.parent_id
          ? {
              parent: {
                connect: {
                  id: args.parent_id,
                },
              },
            }
          : {};

        return context.prisma.createCourse({
          name: args.name,
          description: args.description,
          ...parentInfo,
        });
      },
    });

    t.field("updateCourseDescription", {
      type: Course,
      args: {
        course_id: idArg(),
        description: idArg(),
      },
      resolve: async (_, args, context) => {
        return context.prisma.updateCourse({
          data: {
            description: args.description,
          },
          where: {
            id: args.course_id,
          },
        });
      },
    });

    t.list.field("addUsersToCourse", {
      type: CourseUser,
      args: {
        course_id: idArg(),
        users: arg({
          type: CourseUserAndRole,
          list: true,
        }),
      },
      resolve: async (_, args, context) => {
        const newUsers = args.users.map(({ user_id, role }) =>
          context.prisma.createCourseUser({
            user_type: role,
            user: {
              connect: {
                id: user_id,
              },
            },
            course: {
              connect: {
                id: args.course_id,
              },
            },
          }),
        );
        return Promise.all(newUsers);
      },
    });
  },
});
