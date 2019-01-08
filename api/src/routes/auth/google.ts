import { prisma } from "../../../generated/prisma";
import { Router } from "express";
import { google } from "googleapis";
import { createJWT } from "../../auth";

const getGoogleApiClient = () => {
  const oClient = new google.auth.OAuth2(
    process.env.GOOGLE_APP_CLIENT_ID,
    process.env.GOOGLE_APP_SECRET,
    process.env.GOOGLE_APP_REDIRECT_URL,
  );
  google.options({ auth: oClient });
  return oClient;
};

const googleAuthRouter = Router();

googleAuthRouter.get("/", (req, res) => {
  const oauth2Client = getGoogleApiClient();
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/plus.login",
    "https://www.googleapis.com/auth/plus.me",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "online",
    scope: scopes,
  });
  return res.redirect(url);
});

googleAuthRouter.post("/complete", async (req, res) => {
  const code = req.body.code;

  const oauth2Client = getGoogleApiClient();
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const { data } = await google
    .oauth2({
      version: "v2",
    })
    .userinfo.get();

  const { email, name, picture } = data;

  // does the user already have an account?
  let account = await prisma.user({ email });
  let firstLogin = false;

  if (!account) {
    // create a new account
    account = await prisma.createUser({
      email,
      name,
      photo: picture,
    });
    firstLogin = true;
  }

  // create the JWT that will be sent to the front end for future authentication
  const jwt = await createJWT({
    id: account.id,
    name: account.name,
    email: account.email,
    photo: account.photo,
    isAdmin: account.isAdmin,
  });

  return res.send(
    JSON.stringify({
      jwt,
      firstLogin,
    }),
  );
});

export default googleAuthRouter;
