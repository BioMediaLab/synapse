import React from "react";
import ReactDOM from "react-dom";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
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

// const updateUser = gql`
//   query updateUser {

//   }
// `;

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
        return (
          <form onSubmit={e => this.updateUser()}>
            <h1>Hey</h1>
          </form>
        );
      }}
    </Query>
  );
};

export default withAuth(withRouter(UserProfile));
