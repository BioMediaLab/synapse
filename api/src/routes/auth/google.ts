import { Router } from "express";
import { google } from "googleapis";

import googleConfig from "../../config/google";

const googleAuthRouter = Router();

googleAuthRouter.get("/", (req, res) => {
  const getGoogleApiClient = () => {
    const oClient = new google.auth.OAuth2(
      googleConfig.appId,
      googleConfig.appSecret,
      googleConfig.appRedirect,
    );
    google.options({ auth: oClient });
    return oClient;
  };

  const oauth2Client = getGoogleApiClient();
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/plus.login",
    "https://www.googleapis.com/auth/plus.me",
  ];

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "online",
    scope: scopes,
  });

  return res.redirect(url);
});

export default googleAuthRouter;
