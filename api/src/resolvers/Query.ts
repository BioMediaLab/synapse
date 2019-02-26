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
      },
      resolve: (parent, { name }, ctx) => {
        return ctx.prisma.users({
          where: {
            name_contains: name,
          },
        });
      },
    });

    t.list.field("courses", {
      type: Course,
      resolve: (parent, args, ctx) => {
        return ctx.prisma.courses();
      },
    });
  },
});
