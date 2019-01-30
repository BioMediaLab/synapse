import * as mg from "mailgun-js";
import * as pug from "pug";
import { User } from "../../generated/prisma";

interface IMailgunHelper {
  _hasClient: boolean;
  _mg?: mg.Mailgun;
  mg: mg.Mailgun;
  sendEmail: () => boolean;
}

const mailgunHelper: IMailgunHelper = {
  _hasClient: false,

  get mg() {
    if (this._hasClient) {
      return this._mg;
    }
    const mailGun = mg({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    });
    this._mg = mailGun;
    return this._mg;
  },

  sendEmail: () => {
    const send = process.env.SEND_EMAIL;
    return send === "1";
  },
};

type EmailSingleSendResult = Promise<{ success: boolean; message: string }>;

export const sendSingleEmail = (
  to: string,
  from: string,
  subject: string,
  body: string,
): EmailSingleSendResult =>
  new Promise((resolve, reject) => {
    if (!mailgunHelper.sendEmail) {
      throw new Error("cannot send email");
    }

    const fullFrom = `${from}@mg.synapse.courses`;
    mailgunHelper.mg.messages().send(
      {
        from: fullFrom,
        to,
        subject,
        html: body,
      },
      (err, resp) => {
        if (err) {
          resolve({
            success: false,
            message: err.message,
          });
        }
        resolve({
          success: true,
          message: resp.message,
        });
      },
    );
  });

export const sendManyEmails = (
  to: User[],
  from: {
    name: string;
    email: string;
  },
  subject: string,
  body: string,
): EmailSingleSendResult =>
  new Promise((resolve, reject) => {
    if (to.length > 999) {
      throw new Error(
        "cannot send more than 1000 messages at a time via mailgun",
      );
    }

    if (!mailgunHelper.sendEmail) {
      throw new Error("cannot send email");
    }

    const fullFrom = `${from.name} <${from.email}@mg.synapse.courses>`;
    mailgunHelper.mg.messages().send(
      {
        from: fullFrom,
        to: to.map(user => user.email),
        subject,
        html: body,
      },
      (err, resp) => {
        if (err) {
          resolve({
            success: false,
            message: err.message,
          });
        }
        resolve({
          success: true,
          message: resp.message,
        });
      },
    );
  });

export const canSendEmail = (): boolean => mailgunHelper.sendEmail();

const TEMPLATE_BASE_DIR = "email-templates";

export const getEmailTempate = (fileName: string) => {
  return pug.compileFile(`${TEMPLATE_BASE_DIR}/${fileName}`);
};
