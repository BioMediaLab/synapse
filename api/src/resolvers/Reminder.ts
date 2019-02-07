import { prismaObjectType } from "nexus-prisma";

export const Reminder = prismaObjectType({
  name: "Reminder",
  definition(t) {
    t.prismaFields();
  },
});
