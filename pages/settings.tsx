import React from "react";
import { withStyles, createStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';


const styles = theme => createStyles({
  rootComp: {
    paddingTop: 2,
  },
  tab: {
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2
  }
});

interface SettingsPageProps {
  classes: {
    rootComp: string,
    tab: string,
  }
  theme: any
}

interface SettingsPageState {
  tab: number,
}

class SettingsPage extends React.Component<SettingsPageProps, SettingsPageState> {
  state = {
    tab: 0,
  };

  handleTabChange = (_, value) => {
    this.setState(state => ({ ...state, tab: value }));
  }

  handletabSwipe = (tab) => {
    this.setState(state => ({ ...state, tab }));
  }

  render() {
    const { classes, theme } = this.props;
    return (
      <div className={classes.rootComp}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.tab}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Account Settings" />
            <Tab label="About Me" />
            <Tab label="3rd Party Integrations" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={this.state.tab}
          onChangeIndex={this.handleTabChange}
        >
          <div className={classes.tab}>
            Add an activation code:
          </div>
          <div className={classes.tab}>
            Nickname
            Profile pic
          </div>
          <div className={classes.tab}>
            Google
          </div>
        </SwipeableViews>
      </div>
    );
  }
}

export default withStyles(styles)(SettingsPage);