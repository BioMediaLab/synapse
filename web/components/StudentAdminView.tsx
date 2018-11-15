import React from "react";
import {
  Paper,
  TextField,
  createStyles,
  withStyles,
  List,
  LinearProgress,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { graphql, ChildDataProps } from "react-apollo";
import gql from "graphql-tag";
import { DocumentNode } from "graphql";
import ErrorMessage from "./ErrorMessage";
import CourseMemberListItem from "./CourseMemberListItem";
import UserSearch from "./UserSearch";

const styles = theme =>
  createStyles({
    header: {
      marginRight: theme.spacing.unit,
      marginTop: theme.spacing.unit,
      padding: theme.spacing.unit,
    },
    main: {
      paddingRight: theme.spacing.unit,
    },
    addDialog: {
      minWidth: theme.spacing.unit * 100,
      minHeight: theme.spacing.unit * 20,
      zIndex: 10,
    },
  });

interface IStyles {
  classes: { header: string; main: string; addDialog: string };
}

interface IQueryVars {
  courseId: string;
  startOn: string;
  numRecords: number;
}

interface IQueryResult {
  course: {
    id: string;
    users: Array<{ id: string; name: string; email: string; photo: string }>;
  };
}

const READ_USERS: DocumentNode = gql`
  query($courseId: ID!, $startOn: String, $numRecords: Int) {
    course(where: { id: $courseId }) {
      id
      users(after: $startOn, first: $numRecords, orderBy: name_ASC) {
        id
        name
        email
        photo
      }
    }
  }
`;

interface IStudentAdminViewProps {
  courseId: string;
}

interface IState {
  addDialogOpen: boolean;
}

type Props = ChildDataProps<
  IStudentAdminViewProps & IStyles,
  IQueryResult,
  IQueryVars
>;

class StudentAdminView extends React.Component<Props, IState> {
  state = { addDialogOpen: false };

  showAddDialog = () => {
    this.setState(state => ({ ...state, addDialogOpen: true }));
  };

  hideAddDialog = () => {
    this.setState(state => ({ ...state, addDialogOpen: false }));
  };

  render() {
    let listView = <LinearProgress />;
    if (!this.props.data.loading && !this.props.data.error) {
      listView = (
        <List>
          {this.props.data.course.users.map(user => (
            <CourseMemberListItem
              key={user.id}
              user={user}
              admin
              removeCallback={() => console.log}
            />
          ))}
        </List>
      );
    }
    if (this.props.data.error) {
      listView = <ErrorMessage message={this.props.data.error.message} />;
    }
    return (
      <div>
        <Paper className={this.props.classes.header}>
          <Grid container>
            <TextField label="Search for students" />
            <Button onClick={this.showAddDialog}>Add new members</Button>
          </Grid>
        </Paper>
        <div className={this.props.classes.main}>{listView}</div>
        <Dialog
          open={this.state.addDialogOpen}
          onClose={this.hideAddDialog}
          maxWidth="md"
        >
          <DialogTitle>Choose new members</DialogTitle>
          <DialogContent className={this.props.classes.addDialog}>
            <UserSearch />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.hideAddDialog}>
              Save
            </Button>
            <Button onClick={this.hideAddDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default graphql<IStudentAdminViewProps, IQueryResult, IQueryVars>(
  READ_USERS,
)(withStyles(styles)(StudentAdminView));
