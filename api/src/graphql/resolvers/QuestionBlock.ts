import { prisma } from "../../../generated/prisma";

export const QuestionBlock = {
  course: {
    resolver: async root => {
      return prisma.questionBlock({ id: root.id }).course();
    },
  },
  questions: {
    resolver: async root => {
      return prisma.questionBlock({ id: root.id }).questions();
    },
  },
};
