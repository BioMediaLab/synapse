import React from "react";
import Login from "../components/Login";
import { parseCookie } from "../lib/handleSessions";
import { NextFunctionComponent, NextContext } from "next";
import { ServerResponse } from "http";
import { addDays } from "date-fns";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { MeStore } from "../stores/MeStore";

const doRedirect = (res: ServerResponse, path: string) => {
  res.writeHead(302, { Location: path });
  res.end();
};

const LoginPage: NextFunctionComponent = () => {
  return (
    <div>
      <Login />
    </div>
  );
};

LoginPage.getInitialProps = async ({ req, res, query }: NextContext) => {
  const isServer = !!req;

  if (isServer && query.code) {
    const code = query.code;
    const redirectUrl = query.state as string;

    if (req.headers.cookie && parseCookie(req.headers.cookie as any).session) {
      // we already have the session, so we can redirect them to the main page.
      doRedirect(res, redirectUrl);
    }

    // make a request to the api server to get a JWT.
    const response = await fetch(
      `${publicRuntimeConfig.API_URL}auth/google/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ code }),
      },
    );

    // everything worked out, we should create the session cookie
    const result = await response.json();
    const expDate = addDays(new Date(), 30).toUTCString();

    res.setHeader(
      "Set-Cookie",
      `session=${result.jwt}; Path=/; Expires=${expDate};`,
    );

    const me = new MeStore();

    me.setMe(result.user);

    doRedirect(res, redirectUrl);
  }
};

export default LoginPage;
