import React from "react";

import { createStyles, withStyles } from "@material-ui/core/styles";
import withAuth from "../lib/withAuth";

const styles = theme =>
  createStyles({
    root: {
      // marginTop: theme.spacing.unit * -3,
      // marginLeft: theme.spacing.unit * -3,
    },
  });
interface ISettingsPageProps {
  classes: {
    root: string;
  };
}
class SettingsPage extends React.Component<ISettingsPageProps> {
  render() {
    return <div className={this.props.classes.root}>Settings Page</div>;
  }
}

export default withAuth(withStyles(styles)(SettingsPage));
