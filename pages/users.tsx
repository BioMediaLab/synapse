import React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import App from "../components/App";
import ErrorMessage from "../components/ErrorMessage";

function UserProfile({ data: { loading, error, user } }) {
  if (error)
    return <ErrorMessage message={error}>Error loading user.</ErrorMessage>;
  if (loading) return <App>Loading...</App>;

  return <App>{user.name}</App>;
}

const GET_USER = gql`
  query User() {
    user(id: "cjmcbo8j3zxsa0b051ps89tp9") {
      name
    }
  }
`;

export default graphql(GET_USER)(UserProfile);
