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

const GET_USER = gql`
  query user($userID: String!) {
    user(id: $userID) {
      id
      name
      email
    }
  }
`;

const UserProfile: React.SFC<IUserProps> = ({ router }) => {
  const userID = router.query.id;

  return (
    <Query query={GET_USER} variables={{ userID }}>
      {({ loading, error, data: { user } }) => {
        if (loading) {
          return <div>Loading...</div>;
        }
        if (error) {
          return <ErrorMessage message={error.message} />;
        }

        return (
          <div>
            <Typography variant="display1">{user.name}</Typography>
            <Typography variant="subheading">{user.email}</Typography>
          </div>
        );
      }}
    </Query>
  );
};

export default withAuth(withRouter(UserProfile));
