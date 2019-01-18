import { prisma } from "../../../generated/prisma";

export const CourseUnit = {
  items: {
    resolver: async (root, args, context) => {
      return prisma.courseUnit({ id: root.id }).items();
    },
  },
};
