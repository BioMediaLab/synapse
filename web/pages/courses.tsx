import React from "react";
import { withRouter, WithRouterProps } from "next/router";
import { Query, Mutation, graphql } from "react-apollo";
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
} from "@material-ui/core";

import withAuth from "../lib/withAuth";
import { Link } from "../Router";
import { CREATE_COURSE_MESSAGE } from "../queries/courseQueries";
import ErrorMessage from "../components/ErrorMessage";
import CourseHeader from "../components/CourseHeader";
import MessageView from "../components/MessageView";
import ProfilePic from "../components/ProfilePic";
import WriteMessage from "../components/WriteMessage";

const UserRoleDisplay = ({ users, role, rolePretty }) => {
  const thisRole = users.filter(courseUser => courseUser.user_type === role);
  if (thisRole.length === 0) {
    return <span />;
  }

  return (
    <>
      <Typography variant="h6" style={{ fontWeight: 500 }}>
        {rolePretty} ({thisRole.length})
      </Typography>

      <Divider />

      <List>
        {thisRole.map(({ user }) => (
          <Link route="users" params={{ id: user.id }} key={user.id}>
            <ListItem key={user.id} button>
              <ProfilePic user={{ name: user.name, photo: user.photo }} />
              <ListItemText primary={user.name} />
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
    course(where: { id: $courseId }) {
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
          photo
        }
      }
      announcements {
        id
        message {
          id
          body
          subject
          creator {
            id
            name
            photo
          }
          updatedAt
          createdAt
        }
      }
    }
  }
`;

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

  toggleMessageEdit = () => {
    this.setState(state => ({
      ...state,
      creatingMessage: !state.creatingMessage,
    }));
  };

  render() {
    const courseId = this.props.router.query.id;

    return (
      <main>
        <Query query={COURSE_INFO} variables={{ courseId }}>
          {({ loading, error, data }) => {
            if (loading) {
              return <div>Loading...</div>;
            }
            if (error) {
              return <ErrorMessage message={error.message} />;
            }

            const myRole: string = data.myRoleInCourse.user_type;
            const { course } = data;

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

            const canICreateMessages =
              myRole === "ADMIN" ||
              myRole === "PROFESSOR" ||
              myRole === "ASSISTANT";

            return (
              <Grid container spacing={16} className={this.props.classes.root}>
                <Grid item xs={9}>
                  <CourseHeader course={course} />
                  <Divider />
                  {canICreateMessages ? (
                    <Mutation mutation={CREATE_COURSE_MESSAGE}>
                      {(doMutation, { loading: mutationLoading, error }) => {
                        return (
                          <div>
                            {this.state.creatingMessage ? (
                              <WriteMessage
                                onSaveCallback={(title, body) => {
                                  this.toggleMessageEdit();
                                  doMutation({
                                    variables: {
                                      subject: title,
                                      courseId,
                                      body: JSON.stringify(body),
                                    },
                                  });
                                }}
                                onCancelCallback={() => {
                                  this.toggleMessageEdit();
                                }}
                              />
                            ) : (
                              <Button
                                onClick={this.toggleMessageEdit}
                                disabled={mutationLoading}
                              >
                                Create New Annoucement
                              </Button>
                            )}
                          </div>
                        );
                      }}
                    </Mutation>
                  ) : (
                    <React.Fragment />
                  )}
                  {announcements}
                </Grid>

                <Grid item xs={3}>
                  <UserRoleDisplay
                    users={course.userRoles}
                    role="PROFESSOR"
                    rolePretty="Professors"
                  />
                  <Divider />
                  <UserRoleDisplay
                    users={course.userRoles}
                    role="ASSISTANT"
                    rolePretty="Teaching Assistants"
                  />
                  <Divider />
                  <UserRoleDisplay
                    users={course.userRoles}
                    role="STUDENT"
                    rolePretty="Students"
                  />
                  <Divider />
                  <UserRoleDisplay
                    users={course.userRoles}
                    role="ADMIN"
                    rolePretty="Administrators"
                  />
                  <Divider />
                  <UserRoleDisplay
                    users={course.userRoles}
                    role="AUDITOR"
                    rolePretty="Auditors"
                  />
                </Grid>
              </Grid>
            );
          }}
        </Query>
      </main>
    );
  }
}

export default withAuth(withRouter(withStyles(styles)(Courses)));
