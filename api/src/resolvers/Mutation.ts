import { mutationType, idArg, stringArg, booleanArg } from "nexus";

export const Mutation = mutationType({
  definition(t) {
    t.field("addCourseUnit", {
      type: "CourseUnit",
      args: {
        course_id: idArg(),
        name: stringArg(),
        description: stringArg(),
        visible: booleanArg({ nullable: true, default: false }),
      },
      resolve: (parent, { course_id, name, description, visible }, ctx) => {
        return ctx.prisma.createCourseUnit({
          course: {
            connect: {
              id: course_id,
            },
          },
          name,
          description,
          visible,
        });
      },
    });
  },
});
