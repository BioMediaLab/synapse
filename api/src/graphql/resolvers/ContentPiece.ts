import { prisma } from "../../../generated/prisma";
import { emptyRule } from "../rules";

export const ContentPiece = {
  creator: {
    resolver: async (root, args, context) => {
      return prisma.contentPiece({ id: root.id }).creator();
    },
    shield: emptyRule,
  },
};
