import React from "react";
import {
  Paper,
  TextField,
  createStyles,
  withStyles,
  List,
  LinearProgress,
  Grid,
  Theme,
} from "@material-ui/core";
import { graphql, ChildDataProps, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { DocumentNode } from "graphql";
import { withSnackbar, InjectedNotistackProps } from "notistack";

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

class StudentAdminView extends React.Component<Props, {}> {
  render() {
    let listView = <LinearProgress />;
    if (!this.props.data.loading && !this.props.data.error) {
      listView = (
        <Mutation mutation={REMOVE_USER_MUTATION}>
          {mutate => (
            <List>
              {this.props.data.course.users.map(user => (
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
    return (
      <div>
        <Paper className={this.props.classes.header}>
          <Grid container justify="space-between">
            <TextField
              className={this.props.classes.textField}
              label="Filter For Students"
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
