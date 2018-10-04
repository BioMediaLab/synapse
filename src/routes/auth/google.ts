import { Router } from "express";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

import googleConfig from "../../config/google";

const googleAuthRouter = Router();

googleAuthRouter.get("/", (req, res) => {
  const getGoogleApiClient = (): OAuth2Client => {
    const oauth2Client = new google.auth.OAuth2(
      googleConfig.appId,
      googleConfig.appSecret,
      googleConfig.appRedirect,
    );
    google.options({ auth: oauth2Client });
    return oauth2Client;
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
