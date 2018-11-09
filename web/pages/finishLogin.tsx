import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { withRouter, WithRouterProps } from "next/router";
import { Router } from "../Router";
import { AppBar, Toolbar, LinearProgress, Typography } from "@material-ui/core";

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
  constructor(props) {
    super(props);
  }

  getInitialProps(stuff) {
    console.log(stuff);
  }

  componentDidMount() {
    window.location.href = "/";
  }

  render() {
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
      </main>
    );
  }
}

export default withStyles(styles)(withRouter(FinishLoginMain));
