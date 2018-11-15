import React from "react";
import {
  Paper,
  TextField,
  createStyles,
  withStyles,
  List,
  LinearProgress,
  Grid,
} from "@material-ui/core";
import { graphql, ChildDataProps } from "react-apollo";
import gql from "graphql-tag";
import { DocumentNode } from "graphql";

import ErrorMessage from "./ErrorMessage";
import CourseMemberListItem from "./CourseMemberListItem";
import AddStudentsToCourse from "./AddStudentsToCourse";

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
  });

interface IStyles {
  classes: { header: string; main: string };
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

type Props = ChildDataProps<
  IStudentAdminViewProps & IStyles,
  IQueryResult,
  IQueryVars
>;

class StudentAdminView extends React.Component<Props, {}> {
  render() {
    let listView = <LinearProgress />;
    if (!this.props.data.loading && !this.props.data.error) {
      listView = (
        <List>
          {this.props.data.course.users.map(user => (
            <CourseMemberListItem
              key={user.id}
              user={user}
              courseId={this.props.courseId}
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
            <TextField label="Filter For Students" />
            <AddStudentsToCourse curCourseId={this.props.courseId} />
          </Grid>
        </Paper>
        <div className={this.props.classes.main}>{listView}</div>
      </div>
    );
  }
}

export default graphql<IStudentAdminViewProps, IQueryResult, IQueryVars>(
  READ_USERS,
)(withStyles(styles)(StudentAdminView));
