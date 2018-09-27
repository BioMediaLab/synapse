import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "../components/ErrorMessage";

interface Props {
  user_id: object;
}

const GET_USER = gql`
  query user($user_id: String!) {
    user(id: $user_id) {
      id
      name
      email
    }
  }
`;

const UserProfile: React.SFC<Props> = ({ user_id }) => {
  return (
    <Query query={GET_USER} variables={{ user_id }}>
      {({ loading, error, data: { user } }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <ErrorMessage message={error.message} />;

        return <div id="kramer">{user.name}</div>;
      }}
    </Query>
  );
};

UserProfile.getInitialProps = async ({ query }) => {
  return { user_id: query.id };
};

export default UserProfile;
