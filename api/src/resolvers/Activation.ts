import { prismaObjectType } from "nexus-prisma";

export const Activation = prismaObjectType({
  name: "Activation",
  definition(t) {
    t.prismaFields(["*"]);
  },
});
