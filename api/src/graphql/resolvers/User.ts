import { prisma, CourseUser } from "../../../generated/prisma";

export const User = {
  courseRoles: {
    resolver: async ({ id }): Promise<CourseUser> => {
      return prisma.user({ id }).courseRoles();
    },
  },
};
