import { prisma } from "../../../generated/prisma";

export const QuestionLink = {
  question: {
    resolver: async root => {
      return prisma.questionLink({ id: root.id }).question();
    },
  },
};
