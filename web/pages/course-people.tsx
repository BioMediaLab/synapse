import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider,
  Typography,
  createStyles,
  withStyles,
  Button,
  Paper,
} from "@material-ui/core";
import { withRouter, WithRouterProps } from "next/router";
import withAuth from "../lib/withAuth";

import CourseHeader from "../components/CourseHeader";
import ProfilePic from "../components/ProfilePic";

import { Link } from "../Router";
import ErrorMessage from "../components/ErrorMessage";

const UserRoleDisplay = ({ users, role, rolePretty }) => {
  const thisRole = users.filter(courseUser => courseUser.user_type === role);
  if (thisRole.length === 0) {
    return <span />;
  }

  return (
    <>
      <Typography variant="h6" style={{ fontWeight: 500 }}>
        {thisRole.length}{" "}
        {thisRole.length === 1 ? rolePretty.slice(0, -1) : rolePretty}
      </Typography>

      <List>
        {thisRole.map(({ user }) => (
          <Link route="users" params={{ id: user.id }} key={user.id}>
            <ListItem key={user.id} button>
              <ProfilePic
                classesOverride
                user={{ name: user.name, photo: user.photo }}
              />
              <ListItemText primary={user.name} secondary={user.email} />
            </ListItem>
          </Link>
        ))}
      </List>
    </>
  );
};

const COURSE_INFO = gql`
  query($courseId: ID!) {
    myRoleInCourse(course_id: $courseId) {
      id
      user_type
    }
    course(id: $courseId) {
      id
      name
      title
      description
      term
      userRoles {
        id
        user_type
        user {
          id
          name
          email
          photo
        }
      }
    }
  }
`;

class CoursePeople extends Component {
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

          return (
            <Grid container justify="center" spacing={16}>
              <Grid item xs={6}>
                <Paper elevation={0} style={{ marginBottom: "20px" }}>
                  <CourseHeader course={course} />
                </Paper>

                <Paper
                  elevation={0}
                  style={{ border: "1px solid #dadce0", padding: "20px" }}
                >
                  <UserRoleDisplay
                    users={course.userRoles}
                    role="PROFESSOR"
                    rolePretty="Professors"
                  />

                  <UserRoleDisplay
                    users={course.userRoles}
                    role="ASSISTANT"
                    rolePretty="Teaching Assistants"
                  />

                  <UserRoleDisplay
                    users={course.userRoles}
                    role="STUDENT"
                    rolePretty="Students"
                  />

                  <UserRoleDisplay
                    users={course.userRoles}
                    role="ADMIN"
                    rolePretty="Administrators"
                  />

                  <UserRoleDisplay
                    users={course.userRoles}
                    role="AUDITOR"
                    rolePretty="Auditors"
                  />
                </Paper>
              </Grid>
            </Grid>
          );
        }}
      </Query>
    );
  }
}

export default withAuth(withRouter(CoursePeople));
