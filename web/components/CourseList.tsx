import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "../components/ErrorMessage";
import CourseListItem from "./CourseListItem";
import { Link } from "../Router";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";

interface ICourse {
  id: string;
  name: string;
}

const GET_COURSES = gql`
  {
    courses {
      id
      name
    }
    me @client {
      isAdmin
      id
      name
      email
      photo
    }
  }
`;

const CourseList: React.SFC<{}> = () => (
  <Query query={GET_COURSES}>
    {({ loading, error, data }) => {
      if (loading) {
        return <div>Loading...</div>;
      }
      if (error) {
        return <ErrorMessage message={error} />;
      }
      const courses: ICourse[] = data.courses;
      return (
        <div>
          <List>
            <Link route="users" params={{ id: data.me.id }} key={data.me.id}>
              <ListItem button>
                <Avatar alt={data.me.name} src={data.me.photo} />
                <ListItemText
                  primary={data.me.name}
                  secondary={data.me.email}
                />
              </ListItem>
            </Link>

            <Divider />

            {data.me.isAdmin ? (
              <Link href="/admin" key="admin">
                <ListItem button>
                  <Avatar>A</Avatar>
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              </Link>
            ) : null}

            {courses.map(CourseListItem)}
          </List>
        </div>
      );
    }}
  </Query>
);

export default CourseList;
