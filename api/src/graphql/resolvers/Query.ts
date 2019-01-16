import { forwardTo } from "prisma-binding";
import { rule } from "graphql-shield";

import { prisma, CourseUser, User } from "../../../generated/prisma";

const userHasCourseWhere = rule()(async (parent, args, context, info) => {
  const courseId: string = args.where.id;
  return prisma.$exists.courseUser({
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
  });
});

export const Query = {
  myCourseRoles: {
    resolver: async (root, args, context): Promise<CourseUser[]> => {
      const roles = await prisma.user({ id: context.id }).courseRoles();
      return roles;
    },
  },
  course: {
    resolver: forwardTo("bindingDb") as any,
    shield: userHasCourseWhere,
  },
  user: { resolver: forwardTo("bindingDb") as any },
  me: {
    resolver: async (root, args, context): Promise<User> => {
      return prisma.user({ id: context.id });
    },
  },
  userSearch: {
    resolver: async (root, args, context): Promise<User[]> => {
      const { name, email } = args;
      const first = 10;

      // Only search for users from a certain course
      if (args.course_id) {
        return prisma.users({
          where: {
            AND: [
              { OR: [{ name_contains: name }, { email_contains: email }] },
              {
                courseRoles_some: {
                  course: {
                    id: args.course_id,
                  },
                },
              },
            ],
          },
          orderBy: "name_ASC",
          first,
        });
      }

      // we don't need to worry what course they're in
      return prisma.users({
        where: {
          OR: [{ name_contains: `${name}` }, { email_contains: email }],
        },
        orderBy: "name_ASC",
        first,
      });
    },
  },
  recentNotifications: {
    resolver: async (root, args, context) => {
      const read = args.read ? args.read : false;
      const startAt = args.start ? args.start : 0;
      const total = 10;
      const where = {
        target: {
          reads_some: {
            AND: [{ user: { id: context.id } }, { read }],
          },
        },
      };
      const { count } = await prisma
        .notificationsConnection({
          where,
        })
        .aggregate();

      const notificationNodes = await prisma.notifications({
        where,
        orderBy: "createdAt_DESC", // order by date created, starting at the newest date
      });

      const noteFetchers = notificationNodes.map(async node => {
        const reads = await prisma
          .notification({ id: node.id })
          .target()
          .reads({
            where: {
              user: {
                id: context.id,
              },
            },
          });
        const readRecordId = reads[0].id;
        return {
          readRecordId,
          notification: node,
          read,
        };
      });
      const notificationRecords = await Promise.all(noteFetchers);

      return {
        total: count,
        notificationRecords,
      };
    },
  },
  reminders: {
    resolver: async (root, args, context) => {
      return prisma.reminders({
        where: {
          AND: [
            {
              target: {
                users_some: {
                  id: context.id,
                },
              },
            },
            { triggerTime_lt: new Date() },
          ],
        },
        orderBy: "triggerTime_ASC",
      });
    },
  },
};
