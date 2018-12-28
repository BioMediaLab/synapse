import React from "react";
import withAuth from "../lib/withAuth";
import { withRouter } from "next/router";
import { Router } from "next-routes";
import ErrorMessage from "../components/ErrorMessage";
import CourseHeader from "../components/CourseHeader";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";

import { Link } from "../Router";

import Draft from "../components/Draft";
import Typography from "@material-ui/core/Typography";
import { createStyles, withStyles } from "@material-ui/core";
import { COURSE_INFO, CourseQueryComp } from "../queries/courseQueries";

const UserListItem = user => (
  <Link route="users" params={{ id: user.id }} key={user.id}>
    <ListItem key={user.id} button>
      <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>
      <ListItemText primary={user.name} />
    </ListItem>
  </Link>
);

const styles = createStyles(theme => ({
  root: {
    ...theme.mixins.gutters(),
  },
}));

interface ICoursesProps {
  router: Router;
  classes: {
    courseHeading: string;
    root: string;
  };
}

class Courses extends React.Component<ICoursesProps, any> {
  render() {
    const courseId = this.props.router.query.id;

    return (
      <CourseQueryComp query={COURSE_INFO} variables={{ courseId }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <div>Loading...</div>;
          }
          if (error) {
            return <ErrorMessage message={error.message} />;
          }

          const { course } = data;

          return (
            <Grid container spacing={16} className={this.props.classes.root}>
              <Grid item xs={9}>
                <CourseHeader course={course} />

                <Draft />
              </Grid>

              <Grid item xs={3}>
                <Typography variant="h6" style={{ fontWeight: 500 }}>
                  Professors (1)
                </Typography>

                <Divider />

                <Typography variant="h6" style={{ fontWeight: 500 }}>
                  Students ({course.users.length})
                </Typography>

                <Divider />

                <List>{course.users.map(UserListItem)}</List>
              </Grid>
            </Grid>
          );
        }}
      </CourseQueryComp>
    );
  }
}

export default withAuth(withRouter(withStyles(styles)(Courses)));
