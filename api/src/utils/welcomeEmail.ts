import { sendSingleEmail, getEmailTempate, canSendEmail } from "./emailOut";

export const sendWelcomingEmail = async (
  userName: string,
  userEmail: string,
): Promise<boolean> => {
  if (!canSendEmail) {
    return;
  }
  const template = getEmailTempate("welcome.pug");
  const subject = "Welcome To Synapse!";

  const result = await sendSingleEmail(
    userEmail,
    "synapse",
    subject,
    template({ subject, name: userName }),
  );

  if (!result.success) {
    console.warn(result.message);
    return false;
  }

  return true;
};
