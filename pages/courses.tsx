import React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "../components/ErrorMessage";

type Props = {
  data: {
    loading: boolean;
    error: string;
    users: [string];
  };
};

const CoursePage: React.SFC<Props> = ({ data: { loading, error } }) => {
  return <ErrorMessage message={error}>Error loading user.</ErrorMessage>;

};

const GET_COURSE = gql`
  query {
    users
  }
`;

export default graphql(GET_COURSE)(CoursePage as any);
