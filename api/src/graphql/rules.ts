import { prisma } from "../../generated/prisma";
import { rule } from "graphql-shield";

export const emptyRule = rule()(() => true);

export const isAuthed = rule()(async (parent, args, context, info) => {
  if (context.id && typeof context.id === "string") {
    return true;
  }
  return false;
});

export const isSystemAdmin = rule()(async (parent, args, context, info) => {
  const curUser = await prisma.user({ id: context.id });
  return curUser.isAdmin;
});
