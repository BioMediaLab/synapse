import { prisma, Course as CourseType } from "../../../generated/prisma";

export const Activation = {
  course: {
    resolver: async (root): Promise<CourseType> => {
      return prisma.activation({ id: root.id }).course();
    },
  },
};
