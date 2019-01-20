import { prisma } from "../../generated/prisma";
import * as draftToHtml from "draftjs-to-html";
import { getEmailTempate, canSendEmail, sendManyEmails } from "./emailOut";

export const sendCourseMessageEmail = async (
  courseId: string,
  messageId: string,
  creatorId: string,
) => {
  if (!canSendEmail) {
    return;
  }
  const message = await prisma.message({ id: messageId });
  const creator = await prisma.message({ id: messageId }).creator();
  const html = draftToHtml(message.body);

  const course = await prisma.course({ id: courseId });

  const template = getEmailTempate("courseMessage.pug");
  const body = template({
    moreUrl: `https://synapse.courses/courses/${courseId}`,
    body: html,
    subject: message.subject,
    profName: creator.name,
    courseName: course.name,
    title: `New message in ${course.name}`,
  });

  const users = await prisma.users({
    where: {
      AND: [
        {
          courseRoles_some: {
            course: {
              id: courseId,
            },
          },
        },
        {
          acceptsEmails: true,
        },
        { id_not: creatorId },
      ],
    },
  });

  sendManyEmails(
    users,
    { email: "notify", name: course.name },
    `New announcement in ${course.name} on Synapse`,
    body,
  );
};
