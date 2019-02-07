import { prismaObjectType } from "nexus-prisma";

export const CourseUnit = prismaObjectType({
  name: "CourseUnit",
  definition(t) {
    t.prismaFields();
  },
});
