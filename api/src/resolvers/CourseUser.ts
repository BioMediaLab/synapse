import { prismaObjectType } from "nexus-prisma";

export const CourseUser = prismaObjectType({
  name: "CourseUser",
  definition(t) {
    t.prismaFields(["*"]);
  },
});
