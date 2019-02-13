import React from "react";
import {
  withStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Select,
  MenuItem,
  createStyles,
} from "@material-ui/core";
import { graphql, ChildMutateProps } from "react-apollo";
import gql from "graphql-tag";
import { withSnackbar, InjectedNotistackProps } from "notistack";

import UserSearch from "./UserSearch";
import { CourseRoleType, ADD_USERS_TO_COURSE } from "../queries/courseQueries";

const styles = theme =>
  createStyles({
    addDialog: {
      minWidth: theme.spacing.unit * 100,
      minHeight: theme.spacing.unit * 15,
    },
    fullDialog: {
      minHeight: theme.spacing.unit * 20,
    },
    roleSelect: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
  });

interface IStyles {
  classes: {
    addDialog: string;
    fullDialog: string;
    roleSelect: string;
  };
}

interface IProps {
  curCourseId: string;
  userAddCallback?: (userIds: string[]) => void;
}

interface IState {
  addDialogOpen: boolean;
  usersToAdd: any[];
  userType: CourseRoleType;
}

interface IVars {
  courseId: string;
  users: Array<{ user_id: string; role: string }>;
}

type Props = ChildMutateProps<
  IProps & IStyles & InjectedNotistackProps,
  { course: { id: string } },
  IVars
>;

class AddStudentsToCourse extends React.Component<Props, IState> {
  state = {
    addDialogOpen: false,
    usersToAdd: [],
    userType: "PROFESSOR" as CourseRoleType,
  };

  showAddDialog = () => {
    this.setState(state => ({ ...state, addDialogOpen: true }));
  };

  hideAddDialog = () => {
    this.setState(state => ({
      ...state,
      usersToAdd: [],
      addDialogOpen: false,
    }));
  };

  doUserAdd = async () => {
    this.hideAddDialog();
    if (this.props.curCourseId && this.state.usersToAdd.length > 0) {
      const res = await this.props.mutate({
        // TODO: support adding users of different types
        variables: {
          courseId: this.props.curCourseId,
          users: this.state.usersToAdd.map(user => ({
            user_id: user.id,
            role: this.state.userType,
          })),
        },
      });
      if (res && !res.errors) {
        this.props.enqueueSnackbar("Users added", { autoHideDuration: 1000 });
        if (this.props.userAddCallback) {
          this.props.userAddCallback(this.state.usersToAdd);
        }
        return;
      }
    }
    this.props.enqueueSnackbar("An Error Ocurred.", {
      autoHideDuration: 1000,
      variant: "error",
    });
  };

  updateSelectedUsers = users => {
    this.setState(state => ({ ...state, usersToAdd: users }));
  };

  updateSelectUserType = event => {
    this.setState(state => ({ ...state, userType: event.target.value }));
  };

  render() {
    return (
      <>
        <Dialog
          open={this.state.addDialogOpen}
          onClose={this.hideAddDialog}
          maxWidth="md"
          className={this.props.classes.fullDialog}
        >
          <DialogTitle>Choose new members</DialogTitle>
          <DialogContent className={this.props.classes.addDialog}>
            <UserSearch onValueChange={this.updateSelectedUsers} />
            <Typography
              variant="body1"
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>Add these users as</span>
              <Select
                className={this.props.classes.roleSelect}
                value={this.state.userType}
                onChange={this.updateSelectUserType}
              >
                <MenuItem value="PROFESSOR">professors</MenuItem>
                <MenuItem value="ADMIN">administrators</MenuItem>
                <MenuItem value="STUDENT">students</MenuItem>
                <MenuItem value="ASSISTANT">teaching assistants</MenuItem>
                <MenuItem value="AUDITOR">auditors</MenuItem>
              </Select>
              <span>into the class.</span>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={this.doUserAdd}
              disabled={this.state.usersToAdd.length === 0}
            >
              Save
            </Button>
            <Button onClick={this.hideAddDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <Button color="primary" onClick={this.showAddDialog}>
          Add new members
        </Button>
      </>
    );
  }
}

export default graphql<IProps, {}, IVars>(ADD_USERS_TO_COURSE)(
  withSnackbar(withStyles(styles)(AddStudentsToCourse)),
);
