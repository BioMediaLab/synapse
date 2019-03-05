import { mutationType, idArg, stringArg, booleanArg } from "nexus";
import { prismaObjectType } from "nexus-prisma";

export const Mutation = prismaObjectType({
  name: "Mutation",
  definition(t) {
    t.prismaFields(["*"]);
  },
});
