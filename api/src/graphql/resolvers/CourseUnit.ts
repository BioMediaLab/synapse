import { prisma } from "../../../generated/prisma";

export const CourseUnit = {
  contentPieces: {
    resolver: async (root, args, context) => {
      return prisma.courseUnit({ id: root.id }).contentPieces();
    },
  },
};
