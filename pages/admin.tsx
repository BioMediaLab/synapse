import React from "react";
import withAuth from "../lib/withAuth";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


interface AdminPageState {
  curOpenPanel: string | null,
}

class AdminPage extends React.Component<{}, AdminPageState> {
  state = {
    curOpenPanel: null,
  };

  handlePanelOpen = (curOpenPanel) => {
    this.setState(state => ({
      ...state,
      curOpenPanel
    }));
  }

  render() {
    const { curOpenPanel } = this.state;
    return (
      <main>
        <Typography variant="title">Admin Dashboard</Typography>
        <ExpansionPanel
          expanded={curOpenPanel === "course"}
          onChange={(_, isOpen) => { this.handlePanelOpen(isOpen ? "course" : null); }}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
            <Typography>
              Course Settings
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            Blah Blah Blah
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          expanded={curOpenPanel === "user"}
          onChange={(_, isOpen) => { this.handlePanelOpen(isOpen ? "user" : null); }}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
            <Typography>
              User Settings
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            asdfasdf asdf asdf
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </main>
    )
  }
}

export default withAuth(AdminPage);
