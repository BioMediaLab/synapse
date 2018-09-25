import React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import App from "../components/App";
import ErrorMessage from "../components/ErrorMessage";
import CourseListItem from "./CourseListItem";

function CourseList({ data: { loading, error, courses } }) {
  if (error) return <ErrorMessage message={error} />;
  if (loading) return <App>Loading...</App>;

  return <App>{courses.map(CourseListItem)}</App>;
}
const GET_COURSES = gql`
  {
    user(where: { id: "cjmcbo8j3zxsa0b051ps89tp9" }) {
      courses {
        id
        name
      }
    }
  }
`;

export default graphql(GET_COURSES)(CourseList);
