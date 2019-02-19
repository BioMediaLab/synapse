import { prismaObjectType } from "nexus-prisma";

export const Notification = prismaObjectType({
  name: "Notification",
  definition(t) {
    t.prismaFields(["*"]);
  },
});
