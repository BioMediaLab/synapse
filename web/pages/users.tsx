import React from "react";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { withRouter } from "next/router";
import { Router } from "next-routes";

import withAuth from "../lib/withAuth";
import ErrorMessage from "../components/ErrorMessage";
import CourseListItemUserProfile from "../components/CourseListItemUserProfile";
import { GET_USER, UserQueryComp } from "../queries/userQueries";

interface IUserProps {
  user_id: object;
  router: Router;
}

const UserProfile: React.SFC<IUserProps> = ({ router }) => {
  const queryId = router.query.id;
  const userId: string = typeof queryId !== "string" ? queryId[0] : queryId;

  return (
    <UserQueryComp query={GET_USER} variables={{ user: { id: userId } }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <div>Loading...</div>;
        }
        if (error) {
          return <ErrorMessage message={error.message} />;
        }

        const { user } = data;
        const courses = user.courseRoles.map(role => role.course);
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
                <Typography variant="subtitle1" style={{ color: "grey" }}>
                  Courses
                </Typography>
              </ListItem>
              <Divider />
              {courses.map(course => (
                <CourseListItemUserProfile key={course.id} {...course} />
              ))}
            </List>
          </div>
        );
      }}
    </UserQueryComp>
  );
};

export default withAuth(withRouter(UserProfile));
