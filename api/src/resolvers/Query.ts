import { queryType, stringArg } from "nexus";
import { prismaObjectType } from "nexus-prisma";
import { User, Course } from ".";

export const Query = queryType({
  definition(t) {
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
