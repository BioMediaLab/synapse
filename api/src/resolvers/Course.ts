import { prismaObjectType } from "nexus-prisma";

export const Course = prismaObjectType({
  name: "Course",
  definition(t) {
    t.prismaFields(["*"]);
  },
});
