import React from "react";
import withAuth from "../lib/withAuth";
import { withRouter } from "next/router";
import { Router } from "next-routes";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "../components/ErrorMessage";

import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

import { Link } from "../Router";

const UserListItem = user => (
  <Link route="users" params={{ id: user.id }} key={user.id}>
    <ListItem key={user.id} button>
      <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
      <ListItemText primary={user.name} />
    </ListItem>
  </Link>
);

const COURSE_INFO = gql`
  query Course($courseId: ID!) {
    course(where: { id: $courseId }) {
      name
      description
      users {
        id
        name
      }
    }
  }
`;

interface CoursesProps {
  router: Router;
}

class Courses extends React.Component<CoursesProps, any> {
  render() {
    const course_id = this.props.router.query.id;

    return (
      <Query query={COURSE_INFO} variables={{ courseId: course_id }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <div>Loading...</div>;
          }
          if (error) {
            return <ErrorMessage message={error.message} />;
          }

          const { course } = data;

          return (
            <div>
              <Typography variant="display1">{course.name}</Typography>
              <Typography variant="subheading">
                {course.users.length} students
              </Typography>
              <List>{course.users.map(UserListItem)}</List>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withAuth(withRouter(Courses));
