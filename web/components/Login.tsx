import React from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles, createStyles } from "@material-ui/core/styles";

const styles = theme =>
  createStyles({
    layout: {
      width: "auto",
      marginLeft: theme.spacing.unit * 3,
      marginTop: theme.spacing.unit,
      marginRight: theme.spacing.unit * 3,
    },
    paper: {
      [theme.breakpoints.down("sm")]: {
        width: "90%",
      },
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing.unit * 50,
      },
      margin: "auto",
      padding: theme.spacing.unit,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    title: {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit * 2,
    },
    entry: {
      margin: theme.spacing.unit * 2,
    },
  });

interface Props {
  classes: {
    layout: string;
    paper: string;
    title: string;
    entry: string;
  };
}

class Login extends React.Component<Props> {
  signIn = () => {
    location.href = "http://localhost:4000/auth/google";
  };

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <img src="/static/synapse-icon@2x.png" alt="Synapse" height="50" />
          <Typography className={classes.title} variant="title">
            Synapse
          </Typography>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={this.signIn}
          >
            Sign in with Google
          </Button>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(Login);
