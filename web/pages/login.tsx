import React from "react";
import Login from "../components/Login";
import { Router } from "../Router";
import { getSessionFrontend, parseCookie } from "../lib/handleSessions";
import { withRouter, WithRouterProps } from "next/router";
import { ServerResponse } from "http";
import { addDays } from "date-fns";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const doRedirect = (res: ServerResponse, path: string) => {
  res.writeHead(302, { Location: path });
  res.end();
};

class LoginPage extends React.Component<WithRouterProps> {
  static async getInitialProps({ req, res, query }) {
    const isServer = !!req;

    console.log(query);

    if (isServer) {
      const code = query.code;
      const redirectUrl = query.state;

      if (
        req.headers.cookie &&
        parseCookie(req.headers.cookie as any).session
      ) {
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

      doRedirect(res, redirectUrl);
    }
  }

  componentDidMount() {
    // If the user is already logged in, we will redirect them
    // to the main page
    if (getSessionFrontend()) {
      Router.pushRoute("/");
    }
  }
  render() {
    const error = this.props.router.query.err;
    return (
      <div>
        {error ? (
          <div>An error has occurred. You can try logging in below.</div>
        ) : (
          <div />
        )}
        <Login />
      </div>
    );
  }
}

export default withRouter(LoginPage);
