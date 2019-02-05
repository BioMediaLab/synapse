import { stringArg } from "nexus";
import { prismaObjectType } from "nexus-prisma";

export const Query = prismaObjectType("Query", t => {
  t.prismaFields(["user"]);

  t.field("users", "User", {
    list: true,
    resolve: (parent, args, ctx) => {
      return ctx.prisma.users();
    },
  });
});
