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
import withCourseUser, { WithCourseUser } from "../lib/withCourseUser";

const styles = createStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 5,
    color: "grey",
  },
}));

type Props = WithCourseUser<{ classes: { nested } }>;

const CourseModListItems = ({
  userLoading,
  userFetchError,
  courseId,
  user,
  classes,
}: Props) => {
  return (
    <List>
      {userLoading || userFetchError || !user ? (
        <CircularProgress />
      ) : (
        <>
          <Link route="courses" params={{ id: courseId }}>
            <ListItem className={classes.nested} button>
              <CourseHomeIcon color="inherit" />
              <ListItemText primary="Home" />
            </ListItem>
          </Link>

          <Link route="course-files" params={{ id: courseId }}>
            <ListItem className={classes.nested} button>
              <CourseFilesIcon color="inherit" />
              <ListItemText primary="Files" />
            </ListItem>
          </Link>

          <Link route="course-grades" params={{ id: courseId }}>
            <ListItem className={classes.nested} button>
              <GradebookIcon color="inherit" />
              <ListItemText primary="Grades" />
            </ListItem>
          </Link>

          {user.role === "ADMIN" || user.role === "PROFESSOR" ? (
            <Link route="courseAdmin" params={{ id: courseId }}>
              <ListItem className={classes.nested} button>
                <CourseAdminIcon color="inherit" />
                <ListItemText primary="Admin" />
              </ListItem>
            </Link>
          ) : (
            <span />
          )}
        </>
      )}
    </List>
  );
};

export default withCourseUser(withStyles(styles)(CourseModListItems));
