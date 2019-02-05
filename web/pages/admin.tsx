import React from "react";
import {
  createStyles,
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import NewCourse from "../components/NewCourse";
import AdminResignation from "../components/AdminResignation";
import withAuth from "../lib/withAuth";

const styles = theme =>
  createStyles({
    mainContent: {
      paddingTop: theme.spacing.unit * 1,
    },
  });

interface IAdminPageProps {
  classes: {
    mainContent: string;
  };
}

interface IAdminPageState {
  curOpenPanel: string | null;
}

class AdminPage extends React.Component<IAdminPageProps, IAdminPageState> {
  state = {
    curOpenPanel: null,
  };

  handlePanelOpen = curOpenPanel => {
    this.setState(state => ({
      ...state,
      curOpenPanel,
    }));
  };

  render() {
    const { classes } = this.props;
    const { curOpenPanel } = this.state;
    return (
      <main>
        <Typography variant="h6">Admin Dashboard</Typography>
        <div className={classes.mainContent}>
          <ExpansionPanel
            expanded={curOpenPanel === "course"}
            onChange={(_, isOpen) => {
              this.handlePanelOpen(isOpen ? "course" : null);
            }}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Course Settings</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <NewCourse />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={curOpenPanel === "user"}
            onChange={(_, isOpen) => {
              this.handlePanelOpen(isOpen ? "user" : null);
            }}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>User Settings</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <AdminResignation />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </main>
    );
  }
}

export default withAuth(withStyles(styles)(AdminPage));
