import React from "react";
import { withRouter, WithRouterProps } from "next/router";
import { Query } from "react-apollo";
import {
  Avatar,
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider,
  Typography,
  createStyles,
  withStyles,
} from "@material-ui/core";

import { Link } from "../Router";
import Draft from "../components/Draft";
import { COURSE_INFO } from "../queries/courseQueries";
import ErrorMessage from "../components/ErrorMessage";
import CourseHeader from "../components/CourseHeader";
import withAuth from "../lib/withAuth";

const UserListItem = ({ user }) => (
  <Link route="users" params={{ id: user.id }} key={user.id}>
    <ListItem key={user.id} button>
      <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
      <ListItemText primary={user.name} />
    </ListItem>
  </Link>
);

const styles = createStyles(theme => ({
  root: {
    ...theme.mixins.gutters(),
  },
}));

interface ICoursesProps {
  classes: {
    courseHeading: string;
    root: string;
  };
}

class Courses extends React.Component<ICoursesProps & WithRouterProps, any> {
  render() {
    const courseId = this.props.router.query.id;

    return (
      <Query query={COURSE_INFO} variables={{ courseId }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <div>Loading...</div>;
          }
          if (error) {
            return <ErrorMessage message={error.message} />;
          }

          const { course } = data;

          const professors = course.userRoles.filter(
            role => role.user_type === "PROFESSOR",
          );
          const students = course.userRoles.filter(
            role => role.user_type === "STUDENT",
          );
          const admins = course.userRoles.filter(
            role => role.user_type === "ADMIN",
          );

          const profDisplay =
            professors.length > 0 ? (
              <>
                <Typography variant="h6" style={{ fontWeight: 500 }}>
                  Professors ({professors.length})
                </Typography>

                <Divider />

                <List>
                  {professors.map(role => (
                    <UserListItem user={role.user} />
                  ))}
                </List>
              </>
            ) : (
              <span />
            );

          const studentDisplay =
            students.length > 0 ? (
              <>
                <Typography variant="h6" style={{ fontWeight: 500 }}>
                  Students ({students.length})
                </Typography>

                <Divider />

                <List>
                  {students.map(role => (
                    <UserListItem user={role.user} />
                  ))}
                </List>
              </>
            ) : (
              <span />
            );

          const adminDisplay =
            admins.length > 0 ? (
              <>
                <Typography variant="h6" style={{ fontWeight: 500 }}>
                  System Administrators ({admins.length})
                </Typography>

                <Divider />

                <List>
                  {admins.map(role => (
                    <UserListItem key={role.id} user={role.user} />
                  ))}
                </List>
              </>
            ) : (
              <span />
            );

          return (
            <Grid container spacing={16} className={this.props.classes.root}>
              <Grid item xs={9}>
                <CourseHeader course={course} />

                <Draft />
              </Grid>

              <Grid item xs={3}>
                {profDisplay}
                <Divider />
                {studentDisplay}
                <Divider />
                {adminDisplay}
              </Grid>
            </Grid>
          );
        }}
      </Query>
    );
  }
}

export default withAuth(withRouter(withStyles(styles)(Courses)));
