import { prisma } from "../../../generated/prisma";

export const Question = {
  answerChoices: {
    resolver: async root => {
      return prisma.question({ id: root.id }).answerChoices();
    },
  },
};
