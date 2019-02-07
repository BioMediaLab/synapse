import { prismaObjectType } from "nexus-prisma";

export const Message = prismaObjectType({
  name: "Message",
  definition(t) {
    t.prismaFields();
  },
});
