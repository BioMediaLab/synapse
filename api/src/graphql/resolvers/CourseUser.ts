import { prisma, Course, User } from "../../../generated/prisma";

export const CourseUser = {
  course: {
    resolver: async ({ id }): Promise<Course> => {
      return prisma.courseUser({ id }).course();
    },
  },
  user: {
    resolver: async ({ id }): Promise<User> => {
      return prisma.courseUser({ id }).user();
    },
  },
};
