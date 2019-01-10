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
  state = { addDialogOpen: false, usersToAdd: [] };

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
            role: "STUDENT",
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
            <Typography variant="body1">
              Add these users as
              <Select className={this.props.classes.roleSelect} value="student">
                <MenuItem value="student">students</MenuItem>
              </Select>
              into the class.
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

export default graphql<IProps, {}, IVars>(gql`
  mutation($courseId: String!, $users: [CourseUserAndRole!]!) {
    addUsersToCourse(course_id: $courseId, users: $users) {
      id
      userRoles {
        id
        user_type
        user {
          id
          name
        }
      }
    }
  }
`)(withSnackbar(withStyles(styles)(AddStudentsToCourse)));
