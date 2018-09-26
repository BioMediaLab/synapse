import React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import App from "../components/App";
import ErrorMessage from "../components/ErrorMessage";

interface Props {
  data: {
    loading: boolean;
    error: string;
    users: [string];
  };
};

const UserProfile: React.SFC<Props> = ({ data: { loading, error, users } }) => {
  console.log(users);
  if (error)
    return <ErrorMessage message={error}>Error loading user.</ErrorMessage>;
  if (loading) return <App>Loading...</App>;

  return (
    <App>
      {users.map(user => (
        <li key={user}>{user}</li>
      ))}
    </App>
  );
};

const GET_USER = gql`
  query {
    users
  }
`;

export default graphql(GET_USER)(UserProfile as any);
