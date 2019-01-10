import { prisma } from "../../../generated/prisma";
import { IntResolverContext } from "../../graphqlContext";

export const Message = {
  creator: {
    resolver: async (root, args, context: IntResolverContext) => {
      return prisma.message({ id: root.id }).creator();
    },
  },
};
