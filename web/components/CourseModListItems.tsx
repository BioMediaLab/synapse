import React from "react";
import {
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  createStyles,
  withStyles,
} from "@material-ui/core";
import CourseHomeIcon from "@material-ui/icons/Home";
import CourseFilesIcon from "@material-ui/icons/Folder";
import GradebookIcon from "@material-ui/icons/Assessment";
import CourseAdminIcon from "@material-ui/icons/Settings";

import { Link } from "../Router";
import {
  MyRoleInCourseQuery,
  MY_ROLE_IN_A_COURSE,
} from "../queries/courseQueries";

const styles = createStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 5,
    color: "grey",
  },
}));

const CourseModListItems = ({ course, classes }) => {
  return (
    <List>
      <MyRoleInCourseQuery
        query={MY_ROLE_IN_A_COURSE}
        variables={{ courseId: course.id }}
      >
        {({ loading, error, data }) => {
          if (loading || error) {
            return <CircularProgress />;
          }
          const role = data.myRoleInCourse.user_type;
          return (
            <>
              <Link route="courses" params={{ id: course.id }}>
                <ListItem className={classes.nested} button>
                  <CourseHomeIcon color="inherit" />
                  <ListItemText primary="Home" />
                </ListItem>
              </Link>

              <Link route="course-files" params={{ id: course.id }}>
                <ListItem className={classes.nested} button>
                  <CourseFilesIcon color="inherit" />
                  <ListItemText primary="Files" />
                </ListItem>
              </Link>

              <Link route="course-grades" params={{ id: course.id }}>
                <ListItem className={classes.nested} button>
                  <GradebookIcon color="inherit" />
                  <ListItemText primary="Grades" />
                </ListItem>
              </Link>

              {role === "ADMIN" || role === "PROFESSOR" ? (
                <Link route="courseAdmin" params={{ id: course.id }}>
                  <ListItem className={classes.nested} button>
                    <CourseAdminIcon color="inherit" />
                    <ListItemText primary="Admin" />
                  </ListItem>
                </Link>
              ) : (
                <span />
              )}
            </>
          );
        }}
      </MyRoleInCourseQuery>
    </List>
  );
};

export default withStyles(styles)(CourseModListItems);
