import { prismaObjectType } from "nexus-prisma";

export const ContentPiece = prismaObjectType({
  name: "ContentPiece",
  definition(t) {
    t.prismaFields();
  },
});
