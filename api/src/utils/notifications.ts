import { prisma, NotificationType, Notification } from "../../generated/prisma";

const createSingleUserNotification = async (
  userId: string,
  type: NotificationType,
  msg: string,
  addData: any,
): Promise<Notification> => {
  return prisma.createNotification({
    add_data: addData,
    notify_type: type,
    msg,
    target: {
      create: {
        type: "USER",
        user: {
          connect: {
            id: userId,
          },
        },
        reads: {
          create: [
            {
              user: {
                connect: {
                  id: userId,
                },
              },
            },
          ],
        },
      },
    },
  });
};

const createCourseNotification = async (
  courseId: string,
  type: NotificationType,
  msg: string,
  addData: any,
  userExcludes: string[],
): Promise<Notification> => {
  const courseUsers = await prisma.users({
    where: {
      AND: [
        {
          courseRoles_some: {
            course: {
              id: courseId,
            },
          },
        },
        { id_not_in: userExcludes },
      ],
    },
  });

  return prisma.createNotification({
    notify_type: type,
    msg,
    add_data: addData,
    target: {
      create: {
        type: "COURSE",
        course: {
          connect: {
            id: courseId,
          },
        },
        reads: {
          create: courseUsers.map(({ id }) => ({
            user: {
              connect: {
                id,
              },
            },
          })),
        },
      },
    },
  });
};

export const notifyNewCourse = (
  courseId: string,
  courseName: string,
  userId: string,
) => {
  const msg = `You have been added to ${courseName}`;
  const addData = { id: courseId };
  createSingleUserNotification(userId, "NEW_COURSE", msg, addData);
};

export const notifyCourseAnnouncement = (
  courseId: string,
  courseName: string,
  subject: string,
  creatorId: string,
) => {
  const msg = `A new announcement has been posted in ${courseName}: ${subject}`;
  createCourseNotification(
    courseId,
    "COURSE_ANNOUNCEMENT",
    msg,
    { course_id: courseId },
    [creatorId],
  );
};
