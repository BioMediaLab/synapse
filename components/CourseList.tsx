import React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import App from "../components/App";
import ErrorMessage from "../components/ErrorMessage";
import CourseListItem from "./CourseListItem";

type Course = {
  id: string,
  name: string,
}
const GET_COURSES = gql`
  {
    courses {
      id
      name
    }
  }
`;

interface CourseListProps {
  data: {
    loading: boolean,
    error: any,
    courses: Course[],
  }
}

const CourseList = ({ data: { loading, error, courses } }: CourseListProps) => {
  if (error) return <ErrorMessage message={error} />;
  if (loading) return <App>Loading...</App>;

  return <div>{courses.map(CourseListItem)}</div>;
}


export default graphql(GET_COURSES)(CourseList as any);
