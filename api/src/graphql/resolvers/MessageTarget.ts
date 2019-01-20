import { prisma } from "../../../generated/prisma";
import { IntResolverContext } from "../../graphqlContext";

export const MessageTarget = {
  message: {
    resolver: async (root, args, context: IntResolverContext) => {
      return prisma.messageTarget({ id: root.id }).message();
    },
  },
};
