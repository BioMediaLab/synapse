import { prisma } from "../../generated/prisma-client";
import { Router } from "express";
import { google } from "googleapis";
import { createJWT } from "../../utils/jwt";
import { sendWelcomingEmail } from "../../utils/welcomeEmail";

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
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "online",
    scope: scopes,
    state: req.get("Referrer"),
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
  let user = await prisma.user({ email });

  if (!user) {
    // create a new account
    user = await prisma.createUser({
      email,
      name,
      photo: picture,
    });
    sendWelcomingEmail(name, email);
  }

  // create the JWT that will be sent to the front end for future authentication
  const jwt = await createJWT({
    id: user.id,
  });

  return res.send({
    jwt,
    user,
  });
});

export default googleAuthRouter;
