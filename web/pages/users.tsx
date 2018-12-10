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
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
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
          <div style={{ display: "flex", justifyContent: "lex-start" }}>
            <Card style={{ maxWidth: 345, flexGrow: 1 }}>
              <CardMedia style={{ height: 345 }} image={user.photo} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {user.name}
                </Typography>
                <Typography component="p">{user.email}</Typography>
              </CardContent>
            </Card>
            <List style={{ flexGrow: 2, marginLeft: 20 }}>
              <ListItem>
                <Typography variant="subheading" style={{ color: "grey" }}>
                  Courses
                </Typography>
              </ListItem>
              <Divider />
              {user.courses.map(CourseListItemUserProfile)}
            </List>
          </div>
        );
      }}
    </Query>
  );
};

export default withAuth(withRouter(UserProfile));
