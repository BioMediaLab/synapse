import React from "react";
import Login from "../components/Login";
import { Router } from "../Router";
import { getSessionFrontend } from "../lib/handleSessions";
import { withRouter, WithRouterProps } from "next/router";
import nookies from "nookies";

class LoginPage extends React.Component<WithRouterProps> {
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
