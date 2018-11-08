import React from "react";
import gql from "graphql-tag";
import { withApollo, WithApolloClient } from "react-apollo";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { setSessionFrontend } from "../lib/handleSessions";
import { withRouter, WithRouterProps } from "next/router";
import { Router } from "../Router";
import { ApolloClient, ApolloQueryResult } from "apollo-boost";
import { AppBar, Toolbar, LinearProgress, Typography } from "@material-ui/core";

const goToErrorLand = () => {
  Router.pushRoute("/login/err?=1");
};

const GET_JWT_QUERY = gql`
  query Complete($code: String!) {
    confirmSignupGoogle(token: $code) {
      firstLogin
      jwt
    }
  }
`;

interface IConfirmGoogleSignup {
  confirmSignupGoogle: {
    jwt: string;
    firstLogin: boolean;
  };
}

interface IGoogleAuthFinisher {
  query: any;
}

// needs to be a seperate class so that it can use the apollo client
// to make a manual query
class GoogleAuthFinisher extends React.Component<
  IGoogleAuthFinisher & WithApolloClient<ApolloClient<any>>
> {
  componentDidMount() {
    const googleAuthCode = this.props.query.query.code;
    if (!googleAuthCode) {
      console.warn("No google auth code found");
      goToErrorLand();
      return;
    }

    this.props.client
      .query({
        query: GET_JWT_QUERY,
        variables: { code: googleAuthCode },
      })
      .then(
        ({
          data: { confirmSignupGoogle },
          errors,
        }: ApolloQueryResult<IConfirmGoogleSignup>) => {
          if (errors) {
            console.warn(errors);
            goToErrorLand();
            return;
          }
          setSessionFrontend(confirmSignupGoogle.jwt);
          window.location.href = "http://localhost:3000";
        },
      );
  }

  render() {
    return <div />;
  }
}

const GoogleAuth = withApollo<IGoogleAuthFinisher, IConfirmGoogleSignup>(
  GoogleAuthFinisher,
);

const styles = theme =>
  createStyles({
    logo: {
      marginLeft: theme.spacing.unit * 6,
    },
    body: {
      marginTop: theme.spacing.unit * 8,
    },
    centered: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      marginTop: theme.spacing.unit * 1.5,
    },
  });

interface IFinishLoginMainProps {
  classes: {
    logo: string;
    body: string;
    centered: string;
  };
}

type FinishLoginProps = IFinishLoginMainProps & WithRouterProps;

class FinishLoginMain extends React.Component<FinishLoginProps> {
  success: boolean;
  comp: any;
  constructor(props) {
    super(props);

    this.comp = () => <div />;
    this.success = false;
    if (this.props.router.query.type === "google") {
      this.comp = query => <GoogleAuth query={query} />;
      this.success = true;
    }
  }

  componentDidMount() {
    if (!this.success) {
      console.warn("the current authorization flow type was not found");
      goToErrorLand();
    }
  }

  render() {
    const AuthFinisher = this.comp;

    return (
      <main>
        <AppBar>
          <Toolbar>
            <img
              className={this.props.classes.logo}
              src="/static/synapse@2x.png"
              alt="Synapse"
              height="25px"
            />
          </Toolbar>
        </AppBar>
        <div className={this.props.classes.body}>
          <LinearProgress />
          <div className={this.props.classes.centered}>
            <Typography variant="h5">
              Hold on tight. We're logging you in...
            </Typography>
          </div>
        </div>
        <AuthFinisher query={this.props.router.query} />
      </main>
    );
  }
}

export default withStyles(styles)(withRouter(FinishLoginMain));
