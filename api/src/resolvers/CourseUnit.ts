import { prismaObjectType } from "nexus-prisma";

export const CourseUnit = prismaObjectType({
  name: "CourseUnit",
  definition(t) {
    t.prismaFields(["*"]);

    t.list.field("contentPieces", {
      type: "ContentPiece",
      resolve: (parent, args, ctx) => {
        return ctx.prisma.courseUnit({ id: parent.id }).items();
      },
    });
  },
});
