import React from "react";
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Router from 'next/router';

const REMOVE_ADMIN = gql`
  mutation ($myId: String!) {
    promoteUser(id: $myId, admin: false) {
        isAdmin
    }
  }
`;

interface AdminResignationState {
  showDialog: boolean,
}

class AdminResignation extends React.Component<{}, AdminResignationState> {
  state = {
    showDialog: false,
  };

  changeWarning = (open: boolean) => {
    this.setState(state => ({
      ...state,
      showDialog: open,
    }));
  }

  resign = async (resigner) => {
    this.changeWarning(false);
    resigner();
    Router.push({
      pathname: "/",
    });
  }

  render() {
    return (
      <React.Fragment>
        <Button variant="raised" onClick={() => { this.changeWarning(true); }}>
          Resign As Admin
        </Button>
        <Dialog
          open={this.state.showDialog}
          onClose={() => { this.changeWarning(false); }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Give Up Admin Capability?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will permanently remove the admin capability from your account.
              Do you wish to continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { this.changeWarning(false) }} color="primary">
              No
            </Button>
            <Button color="primary" autoFocus onClick={() => { this.resign(() => { }) }}>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default AdminResignation;
