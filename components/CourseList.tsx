import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "../components/ErrorMessage";
import CourseListItem from "./CourseListItem";
import Link from "next/link";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";

interface Course {
  id: string;
  name: string;
};

interface CourseListProps {
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
    }
  }
`;

const CourseList: React.SFC<CourseListProps> = () => (
  <Query query={GET_COURSES}>
    {({ loading, error, data }) => {
      if (loading) return <div>Loading...</div>;
      if (error) return <ErrorMessage message={error} />;
      const courses: Course[] = data.courses;
      return (
        <div>
          {data.me.isAdmin ? <div>
            <Link href="/admin">
              <ListItem button>
                <Avatar>A</Avatar>
                <ListItemText primary="Admin Dashboard" />
              </ListItem>
            </Link>
          </div> : <span />}
          {courses.map(CourseListItem)}
        </div>
      );
    }}
  </Query>
);

export default CourseList;
