import { prismaObjectType } from "nexus-prisma";

export const MessageRead = prismaObjectType({
  name: "MessageRead",
  definition(t) {
    t.prismaFields(["*"]);
  },
});
