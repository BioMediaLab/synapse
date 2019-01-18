import { prisma, CourseUser } from "../../../generated/prisma";

export const Course = {
  userRoles: {
    resolver: async (root): Promise<CourseUser> => {
      return prisma.course({ id: root.id }).userRoles();
    },
  },
  files: {
    resolver: async (root, args, context) => {
      return prisma.course({ id: root.id }).files();
    },
  },
  units: {
    resolver: async root => {
      return prisma.course({ id: root.id }).units();
    },
  },
};
