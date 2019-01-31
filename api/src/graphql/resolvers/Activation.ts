import {
  prisma,
  Course as CourseType,
  User as UserType,
} from "../../../generated/prisma";

export const Activation = {
  course: {
    resolver: async (root): Promise<CourseType> => {
      return prisma.activation({ id: root.id }).course();
    },
  },
  user: {
    resolver: async (root): Promise<UserType> => {
      return prisma.activation({ id: root.id }).user();
    },
  },
};
