import React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import App from "../components/App";
import ErrorMessage from "../components/ErrorMessage";

type Props = {
  data: {
    loading: boolean;
    error: string;
    users: [string];
  };
};

const CoursePage: React.SFC<Props> = ({ data: { loading, error, course } }) => {
  if (error)
    return <ErrorMessage message={error}>Error loading user.</ErrorMessage>;
  if (loading) return <App>Loading...</App>;

  return <App>{course.name}</App>;
};

const GET_COURSE = gql`
  query {
    users
  }
`;

export default graphql(GET_COURSE)(CoursePage as any);
