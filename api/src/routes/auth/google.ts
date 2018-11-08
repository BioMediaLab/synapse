import { Router } from "express";
import { google } from "googleapis";

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

googleAuthRouter.get("/googleComplete", (res, req) => {
  const code = req.get("code");
});

export default googleAuthRouter;
