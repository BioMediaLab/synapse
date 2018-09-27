import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "../components/ErrorMessage";
import CourseListItem from "./CourseListItem";

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
  }
`;

const CourseList: React.SFC<CourseListProps> = () => (
  <Query query={GET_COURSES}>
    {({ loading, error, data: { courses } }) => {
      if (loading) return <div>Loading...</div>;
      if (error) return <ErrorMessage message={error} />;

      return <div>{courses.map(CourseListItem)}</div>;
    }}
  </Query>
);

export default CourseList;
