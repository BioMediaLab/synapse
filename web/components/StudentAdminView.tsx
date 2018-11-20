import React from "react";
import {
  Paper,
  TextField,
  InputAdornment,
  createStyles,
  withStyles,
  List,
  LinearProgress,
  Grid,
  Theme,
  IconButton,
} from "@material-ui/core";
import { Backspace } from "@material-ui/icons";
import { graphql, ChildDataProps, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { DocumentNode } from "graphql";
import { withSnackbar, InjectedNotistackProps } from "notistack";
import Fuse from "fuse.js";

import ErrorMessage from "./ErrorMessage";
import CourseMemberListItem from "./CourseMemberListItem";
import AddStudentsToCourse from "./AddStudentsToCourse";

const REMOVE_USER_MUTATION = gql`
  mutation($courseId: String!, $userIds: [String]!) {
    removeUsersFromCourse(course_id: $courseId, user_ids: $userIds) {
      id
    }
  }
`;

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

const styles = (theme: Theme) =>
  createStyles({
    header: {
      marginRight: theme.spacing.unit,
      marginTop: theme.spacing.unit,
      padding: theme.spacing.unit,
    },
    main: {
      paddingRight: theme.spacing.unit,
    },
    textField: {
      marginBottom: theme.spacing.unit,
      marginLeft: theme.spacing.unit * 2,
      minWidth: "33%",
    },
  });

interface IStyles {
  classes: {
    header: string;
    main: string;
    textField: string;
  };
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

interface IStudentAdminViewProps {
  courseId: string;
}

type Props = ChildDataProps<
  IStudentAdminViewProps & IStyles & InjectedNotistackProps,
  IQueryResult,
  IQueryVars
>;

interface IState {
  filtered: boolean;
  filterText: string;
}

class StudentAdminView extends React.Component<Props, IState> {
  state = {
    filtered: false,
    filterText: "",
  };

  stopFilter = () => {
    this.setState(state => ({ ...state, filterText: "", filtered: false }));
  };

  updateFilter = (filterText: string) => {
    if (filterText.length === 0) {
      this.stopFilter();
      return;
    }
    this.setState(state => ({ ...state, filtered: true, filterText }));
  };

  render() {
    let listView = <LinearProgress />;
    if (
      !this.props.data.loading &&
      !this.props.data.error &&
      this.props.data.course.users
    ) {
      let users = this.props.data.course.users;
      if (this.state.filtered) {
        const sorter = new Fuse(users, {
          shouldSort: true,
          keys: ["name", "email"],
        });
        users = sorter.search(this.state.filterText);
      }

      listView = (
        <Mutation mutation={REMOVE_USER_MUTATION}>
          {mutate => (
            <List>
              {users.map(user => (
                <CourseMemberListItem
                  key={user.id}
                  user={user}
                  admin
                  removeCallback={id => {
                    mutate({
                      variables: {
                        courseId: this.props.courseId,
                        userIds: [id],
                      },
                    }).then(res => {
                      if (!res || !res.data || res.data.error) {
                        console.warn(res);
                        this.props.enqueueSnackbar(`An error ocurred`);
                      } else {
                        this.props.data.refetch();
                        this.props.enqueueSnackbar(
                          `${user.name} was removed from this class.`,
                        );
                      }
                    });
                  }}
                />
              ))}
            </List>
          )}
        </Mutation>
      );
    }
    if (this.props.data.error) {
      listView = <ErrorMessage message={this.props.data.error.message} />;
    }

    const textFilterAdornmentProps = this.state.filtered
      ? {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={this.stopFilter}>
                <Backspace />
              </IconButton>
            </InputAdornment>
          ),
        }
      : {};

    return (
      <div>
        <Paper className={this.props.classes.header}>
          <Grid container justify="space-between">
            <TextField
              className={this.props.classes.textField}
              label="Filter For Students"
              onChange={event => this.updateFilter(event.target.value)}
              value={this.state.filterText}
              InputProps={textFilterAdornmentProps}
            />
            <AddStudentsToCourse
              curCourseId={this.props.courseId}
              userAddCallback={() => {
                this.props.data.refetch();
              }}
            />
          </Grid>
        </Paper>
        <div className={this.props.classes.main}>{listView}</div>
      </div>
    );
  }
}

export default graphql<IStudentAdminViewProps, IQueryResult, IQueryVars>(
  READ_USERS,
)(withSnackbar(withStyles(styles)(StudentAdminView)));
