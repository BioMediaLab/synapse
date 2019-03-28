import { mutationType, idArg, stringArg, booleanArg } from "nexus";
import { Course } from "./Course";
import { User } from "./User";
import { CourseUser } from "./CourseUser";

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
  },
});
