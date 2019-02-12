import { prismaObjectType } from "nexus-prisma";
import { stringArg } from "nexus";

export const User = prismaObjectType({
  name: "User",
  definition(t) {
    t.prismaFields();

    t.list.field("courseRoles", {
      type: "CourseUser",
      resolve: ({ id }, args, ctx) => ctx.prisma.user({ id }).courseRoles(),
    });
  },
});
