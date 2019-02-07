import { arg, stringArg } from "nexus";
import { prismaObjectType } from "nexus-prisma";

export const Query = prismaObjectType("Query", t => {
  t.prismaFields([
    "user",
    "course",
    "courseUser",
    "courseUnit",
    "contentPiece",
    "activation",
    "notification",
    "message",
    "messageTarget",
    "messageRead",
    "reminder",
  ]);

  t.field("users", "User", {
    list: true,
    resolve: (parent, args, ctx) => {
      return ctx.prisma.users();
    },
  });

  // currently the args parameter does not work with latest nexus package
  // works with nexus@0.7.0-alpha.2
  // TODO: look into submitting PR for nexus-prisma to use latest nexus package
  t.field("userSearch", "User", {
    list: true,
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

  t.field("courses", "Course", {
    list: true,
    resolve: (parent, args, ctx) => {
      return ctx.prisma.courses();
    },
  });
});
