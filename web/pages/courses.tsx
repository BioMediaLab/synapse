import React from "react";
import { withRouter, WithRouterProps } from "next/router";
import { Query } from "react-apollo";
import {
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider,
  Typography,
  createStyles,
  withStyles,
} from "@material-ui/core";
import { Mutation } from "react-apollo";

import { Link } from "../Router";
import { COURSE_INFO, CREATE_COURSE_MESSAGE } from "../queries/courseQueries";
import ErrorMessage from "../components/ErrorMessage";
import CourseHeader from "../components/CourseHeader";
import MessageView from "../components/MessageView";
import ProfilePic from "../components/ProfilePic";
import withAuth from "../lib/withAuth";
import WriteMessage from "../components/WriteMessage";

const UserListItem = ({ user }) => (
  <Link route="users" params={{ id: user.id }} key={user.id}>
    <ListItem key={user.id} button>
      <ProfilePic user={{ name: user.name, photo: user.photo }} />
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

interface ICoursesState {
  creatingMessage: boolean;
}

class Courses extends React.Component<
  ICoursesProps & WithRouterProps,
  ICoursesState
> {
  state = {
    creatingMessage: false,
  };

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
                    <UserListItem key={role.id} user={role.user} />
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
                    <UserListItem key={role.id} user={role.user} />
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

          let announcements = <span />;
          if (course.announcements && course.announcements.length > 0) {
            announcements = (
              <>
                <Typography variant="h5">Announcements</Typography>
                {course.announcements.map(ann => (
                  <MessageView
                    key={ann.id}
                    body={ann.message.body}
                    title={ann.message.subject}
                    createdAt={ann.message.createdAt}
                    updatedAt={ann.message.updatedAt}
                    creator={ann.message.creator}
                  />
                ))}
              </>
            );
          }

          return (
            <Grid container spacing={16} className={this.props.classes.root}>
              <Grid item xs={9}>
                <CourseHeader course={course} />
                <Divider />
                {announcements}
                <Mutation mutation={CREATE_COURSE_MESSAGE}>
                  {(doMutation, { loading, error }) => {
                    return (
                      <WriteMessage
                        onSaveCallback={(title, body) => {
                          doMutation({
                            variables: {
                              course_id: courseId,
                              subject: title,
                              body,
                            },
                          });
                        }}
                      />
                    );
                  }}
                </Mutation>
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
