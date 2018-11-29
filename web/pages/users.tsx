import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "../components/ErrorMessage";
import CourseListItemUserProfile from "../components/CourseListItemUserProfile";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import withAuth from "../lib/withAuth";
import { withRouter } from "next/router";
import { Router } from "next-routes";

interface IUserProps {
  user_id: object;
  router: Router;
}

const GET_USER = gql`
  query user($userID: UserWhereUniqueInput!) {
    user(where: $userID) {
      id
      courses {
        id
        name
      }
      name
      email
      photo
    }
  }
`;

const UserProfile: React.SFC<IUserProps> = ({ router }) => {
  const userID = {
    id: router.query.id,
  };
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
          <List>
            <ListItem>
              <Avatar
                alt={user.name}
                src={user.photo}
                style={{ height: 80, width: 80, float: "left", margin: 7 }}
              />
              <div style={{ margin: 14 }}>
                <Typography variant="display1">{user.name}</Typography>
                <Typography variant="subheading">{user.email}</Typography>
              </div>
            </ListItem>
            <Divider />
            <ListItem>
              <Typography variant="subheading" style={{ color: "grey" }}>
                Courses
              </Typography>
            </ListItem>
            {user.courses.map(CourseListItemUserProfile)}
          </List>
        );
      }}
    </Query>
  );
};

export default withAuth(withRouter(UserProfile));
