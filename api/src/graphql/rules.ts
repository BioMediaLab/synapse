import { prisma } from "../../generated/prisma";
import { rule } from "graphql-shield";

export const isAuthed = rule()(async (parent, args, context, info) => {
  if (context.id) {
    return true;
  }
  return false;
});

export const isSystemAdmin = rule()(async (parent, args, context, info) => {
  const curUser = await prisma.user({ id: context.id });
  return curUser.isAdmin;
});

export const userHasCourseWhere = rule()(
  async (parent, args, context, info) => {
    const courseId: string = args.where.id;
    const myRoles = await prisma.courseUsers({
      where: {
        AND: [
          {
            user: {
              id: context.id,
            },
          },
          {
            course: {
              id: courseId,
            },
          },
        ],
      },
    });

    return myRoles.length !== 0;
  },
);
