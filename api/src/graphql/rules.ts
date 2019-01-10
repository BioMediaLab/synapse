import { prisma } from "../../generated/prisma";
import { rule } from "graphql-shield";

export const emptyRule = rule()(() => true);

export const isAuthed = rule()(async (parent, args, context) => {
  if (context.id && typeof context.id === "string") {
    return true;
  }
  return false;
});

export const isSystemAdmin = rule()(async (parent, args, context) => {
  const curUser = await prisma.user({ id: context.id });
  return curUser.isAdmin;
});

export const hasCourseFromId = rule()(async (parent, args, context) => {
  if (!args.course_id) {
    throw new Error("expected to find args.course_id");
  }
  const roles = await prisma.user({ id: context.id }).courseRoles({
    where: {
      course: {
        id: args.course_id,
      },
    },
  });
  return roles.length === 0;
});

export const isCourseAdminFromId = rule()(async (parent, args, context) => {
  if (!args.course_id) {
    throw new Error("expected to find args.course_id");
  }
  const role = await prisma.user({ id: context.id }).courseRoles({
    where: {
      course: {
        id: args.course_id,
      },
    },
  })[0];
  return role.user_type === "ADMIN";
});

export const isCourseProfessorFromId = rule()(async (parent, args, context) => {
  if (!args.course_id) {
    throw new Error("expected to find args.course_id");
  }
  const role = await prisma.user({ id: context.id }).courseRoles({
    where: {
      course: {
        id: args.course_id,
      },
    },
  })[0];
  return role.user_type === "PROFESSOR";
});

export const isCourseAssistantFromId = rule()(async (parent, args, context) => {
  if (!args.course_id) {
    throw new Error("expected to find args.course_id");
  }
  const role = await prisma.user({ id: context.id }).courseRoles({
    where: {
      course: {
        id: args.course_id,
      },
    },
  })[0];
  return role.user_type === "ASSISTANT";
});
