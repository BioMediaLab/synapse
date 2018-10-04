import React from "react";
import gql from "graphql-tag";
import { ApolloConsumer } from "react-apollo";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles, createStyles } from "@material-ui/core/styles";
import { setSessionFrontend } from "../lib/handleSessions";

const GET_JWT_QUERY = gql`
  query Complete($code: String!) {
    confirmSignupGoogle(token: $code) {
      firstLogin
      jwt
    }
  }
`;

// needs to be a seperate class so that it can use the apollo client
// to make a manual query
class Fetcher extends React.Component<any> {
  componentDidMount() {
    const myGetParams = new URLSearchParams(location.search);
    if (!myGetParams.has("code")) {
      window.location = `${window.location.protocol}//${
        window.location.host
        }/login` as any;
      console.warn("no google auth code found");
      return;
    }
    const googleAuthCode = myGetParams.get("code");

    this.props.client
      .query({
        query: GET_JWT_QUERY,
        variables: { code: googleAuthCode },
      })
      .then(({ data: { confirmSignupGoogle } }) => {
        setSessionFrontend(confirmSignupGoogle.jwt);
        window.location = `${window.location.protocol}//${
          window.location.host
          }/` as any;
      });
  }

  render() {
    return <div />;
  }
}

const styles = theme =>
  createStyles({
    progress: {
      margin: theme.spacing.unit * 2,
    },
  });

interface FinishLoginMainProps {
  classes: {
    progress: string;
  };
}

class FinishLoginMain extends React.Component<FinishLoginMainProps> {
  render() {
    return (
      <ApolloConsumer>
        {client => (
          <React.Fragment>
            <Fetcher client={client} />
            <div>
              <CircularProgress
                size={100}
                className={this.props.classes.progress}
              />
            </div>
          </React.Fragment>
        )}
      </ApolloConsumer>
    );
  }
}

export default withStyles(styles)(FinishLoginMain);
