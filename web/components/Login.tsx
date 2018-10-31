import React from "react";
import SignInWithGoogleButton from "../components/SignInWithGoogleButton";
import Typography from "@material-ui/core/Typography";
import { withStyles, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const styles = theme =>
  createStyles({
    root: {
      height: "100%",
      flexGrow: 1,
      backgroundColor: theme.palette.primary.main,
    },
    logo_container: {
      width: "100%",
      textAlign: "center",
      paddingBottom: theme.spacing.unit * 4,
    },
  });

interface IProps {
  classes: {
    root: string;
    paper: string;
    logo_container: string;
  };
}

class Login extends React.Component<IProps> {
  signIn = () => {
    location.href = "http://localhost:4000/auth/google";
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid
        container
        direction="row"
        className={classes.root}
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <div className={classes.logo_container}>
            <img src="/static/synapse@2x.png" alt="Synapse" height="35px" />
          </div>
          <SignInWithGoogleButton onClick={this.signIn} />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Login);
