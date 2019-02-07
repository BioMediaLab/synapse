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

  t.field("courses", "Course", {
    list: true,
    resolve: (parent, args, ctx) => {
      return ctx.prisma.courses();
    },
  });
});
