import { prisma } from "../../../generated/prisma";

export const Notification = {
  target: {
    resolver: async (root, args) => {
      return prisma.notification({ id: root.id }).target();
    },
  },
};
