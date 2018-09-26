import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { withStyles, createStyles } from "@material-ui/core/styles";

import Redirect from "../components/Redirect";

const GET_REDIRECT_URI = gql`
  query Login($email: String!) {
    googleUri(email: $email)
  }
`;

const styles = theme =>
  createStyles({
    layout: {
      width: "auto",
      marginLeft: theme.spacing.unit * 3,
      marginTop: theme.spacing.unit,
      marginRight: theme.spacing.unit * 3
    },
    paper: {
      [theme.breakpoints.down("sm")]: {
        width: "90%"
      },
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing.unit * 50
      },
      margin: "auto",
      padding: theme.spacing.unit,
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    title: {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit * 2
    },
    entry: {
      margin: theme.spacing.unit * 2,
    }
  });

interface Props {
  classes: {
    layout: string;
    paper: string;
    title: string;
    entry: string;
  };
};

interface LoginState {
  emailEntry: string,
  emailEntered: boolean,
  moveOnReady: boolean,
}


class LoginPage extends React.Component<Props, LoginState> {
  constructor(props) {
    super(props);

    this.state = {
      emailEntry: "",
      emailEntered: false,
      moveOnReady: false,
    };
  }

  onEmailEntryChange = (event) => {
    const emailEntry = event.target.value;
    const moveOnReady = false;
    this.setState(state => ({
      ...state,
      moveOnReady,
      emailEntry,
    }));
  }

  continueWithSignin = () => {
    this.setState(state => ({
      ...state,
      emailEntered: true,
    }));
  }

  render() {
    const { classes } = this.props;

    let main = (
      <React.Fragment>
        <img src="/static/synapse-icon@2x.png" alt="Synapse" height="50" />
        <Typography className={classes.title} variant="title">
          Welcome to Synapse
        </Typography>
        <Typography variant="subheading">
          To continue, please log in below.
        </Typography>
        <ValidatorForm ref="form" onSubmit={this.continueWithSignin}>
          <TextValidator
            className={classes.entry}
            type="email"
            name="email"
            autoComplete="email"
            variant="outlined"
            label="Umaine Email"
            value={this.state.emailEntry}
            onChange={this.onEmailEntryChange}
            validators={['required', 'isEmail']}
            errorMessages={['this field is required', 'email is not valid']}
          />
          <Button
            type="submit"
            variant="raised"
            color="primary"
          >
            Continue
        </Button>
        </ValidatorForm>
      </React.Fragment>
    );

    if (this.state.emailEntered) {
      const loadingBody = (<div>Loading...</div>);

      main = (
        <Query query={GET_REDIRECT_URI} variables={{ email: this.state.emailEntry }}>
          {({ loading, data, error }) => {
            if (loading || error) {
              return loadingBody;
            }
            return (
              <React.Fragment>
                <Redirect url={data.googleUri} />
                <CircularProgress size={100} />
              </React.Fragment>
            );
          }}
        </Query >
      );
    }

    return (
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          {main}
        </Paper>
      </main>
    );

  }
}


export default withStyles(styles)(LoginPage);
