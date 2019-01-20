import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import withAuth from "../lib/withAuth";
import AccountSettings from "../components/AccountSettings";

const styles = theme =>
  createStyles({
    rootComp: {
      marginTop: theme.spacing.unit * -3,
      marginLeft: theme.spacing.unit * -3,
      width: "110%",
    },
    tab: {
      paddingTop: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 2,
    },
  });

interface ISettingsPageProps {
  classes: {
    rootComp: string;
    tab: string;
  };
  theme: any;
}

interface ISettingsPageState {
  tab: number;
}

class SettingsPage extends React.Component<
  ISettingsPageProps,
  ISettingsPageState
> {
  state = {
    tab: 0,
  };

  handleTabChange = (_, value) => {
    this.setState(state => ({ ...state, tab: value }));
  };

  handletabSwipe = tab => {
    this.setState(state => ({ ...state, tab }));
  };

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.rootComp}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.tab}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Account Settings" />
            <Tab label="3rd Party Integrations" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={this.state.tab}
          onChangeIndex={this.handleTabChange}
        >
          <div className={classes.tab}>
            <AccountSettings />
          </div>
          <div className={classes.tab}>Google</div>
        </SwipeableViews>
      </main>
    );
  }
}

export default withAuth(withStyles(styles)(SettingsPage));
