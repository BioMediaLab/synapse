import { queryType, stringArg } from "nexus";
import { prismaObjectType } from "nexus-prisma";
import { User, Course } from ".";

export const Query = queryType({
  definition(t) {
    t.field("currentUser", {
      type: User,
      resolve: async (parent, args, ctx) => {
        const user = await ctx.prisma.user({ id: ctx.user_id });

        if (!user.hasVisited) {
          // update the user object to record their visit
          await ctx.prisma.updateUser({
            where: { id: ctx.user_id },
            data: { hasVisited: true },
          });
        }

        return user;
      },
    });

    t.list.field("users", {
      type: User,
      resolve: (parent, args, ctx) => {
        return ctx.prisma.users();
      },
    });

    t.list.field("userSearch", {
      type: User,
      args: {
        name: stringArg(),
        email: stringArg({ nullable: true }),
        course_id: stringArg({ nullable: true }),
      },
      resolve: (parent, { name, email, course_id }, ctx) => {
        const first = 10;

        // Only search for users from a certain course
        if (course_id) {
          return ctx.prisma.users({
            where: {
              AND: [
                { OR: [{ name_contains: name }, { email_contains: email }] },
                {
                  courseRoles_some: {
                    course: {
                      id: course_id,
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
        return ctx.prisma.users({
          where: {
            OR: [{ name_contains: name }, { email_contains: email }],
          },
          orderBy: "name_ASC",
          first,
        });
      },
    });

    t.list.field("courses", {
      type: Course,
      resolve: (parent, args, ctx) => {
        return ctx.prisma.courses();
      },
    });

    t.list.field("myCourseRoles", {
      type: "CourseUser",
      resolve: (parent, args, ctx) => {
        return ctx.prisma.user({ id: ctx.user_id }).courseRoles();
      },
    });
  },
});
