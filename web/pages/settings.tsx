import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "../components/ErrorMessage";
import Typography from "@material-ui/core/Typography";
import withAuth from "../lib/withAuth";
import { withRouter } from "next/router";
import { Router } from "next-routes";

interface IUserProps {
  user_id: object;
  router: Router;
}

const getUser = gql`
  query {
    me @client {
      id
      name
      email
      bio
      iClickerID
    }
  }
`;

const UserProfile: React.SFC<IUserProps> = () => {
  return (
    <Query query={getUser}>
      {({ loading, error, data }) => {
        if (loading) {
          return <div>Loading...</div>;
        }
        if (error) {
          return <ErrorMessage message={error.message} />;
        }
        {
          console.log(data);
        }
        return <div>Completed</div>;
      }}
    </Query>
  );
};

export default withAuth(withRouter(UserProfile));
