import React from "react";
import { Query } from "react-apollo";
import ErrorMessage from "../components/ErrorMessage";
import CourseListItemUserProfile from "../components/CourseListItemUserProfile";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import withAuth from "../lib/withAuth";
import { withRouter } from "next/router";
import { Router } from "next-routes";
import { GET_COURSES } from "../components/CourseList";
interface IUserProps {
  user_id: object;
  router: Router;
}

const UserProfile: React.SFC<IUserProps> = ({ router }) => {
  const userID = router.query.id;

  return (
    <Query query={GET_COURSES} variables={{ userID }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <div>Loading...</div>;
        }
        if (error) {
          return <ErrorMessage message={error.message} />;
        }

        return (
          <div>
            <Card style={{ maxWidth: 400, height: 130, marginBottom: 50 }}>
              <CardContent style={{ marginBottom: 30 }}>
                <Avatar
                  alt={data.me.name}
                  src={data.me.photo}
                  style={{ height: 80, width: 80, float: "left", margin: 7 }}
                />
                <div style={{ margin: 14, marginLeft: 30, float: "left" }}>
                  <Typography variant="display1">{data.me.name}</Typography>
                  <Typography variant="subheading">{data.me.email}</Typography>
                </div>
              </CardContent>
            </Card>
            <Typography
              variant="subheading"
              style={{ color: "grey", margin: 5 }}
            >
              Courses
            </Typography>
            {data.courses.map(CourseListItemUserProfile)}
          </div>
        );
      }}
    </Query>
  );
};

export default withAuth(withRouter(UserProfile));
