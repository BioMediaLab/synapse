import { prismaObjectType } from "nexus-prisma";

export const MessageTarget = prismaObjectType({
  name: "MessageTarget",
  definition(t) {
    t.prismaFields(["*"]);
  },
});
