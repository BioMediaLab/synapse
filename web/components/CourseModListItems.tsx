import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import CourseHomeIcon from "@material-ui/icons/Home";
import CourseFilesIcon from "@material-ui/icons/Folder";
import GradebookIcon from "@material-ui/icons/Assessment";
import CourseAdminIcon from "@material-ui/icons/Settings";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { Link } from "../Router";

const styles = createStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 5,
    color: "grey",
  },
}));

const CourseModListItems = ({ course, classes }) => {
  return (
    <List>
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

      <Link route="courseAdmin" params={{ id: course.id }}>
        <ListItem className={classes.nested} button>
          <CourseAdminIcon color="inherit" />
          <ListItemText primary="Admin" />
        </ListItem>
      </Link>
    </List>
  );
};

export default withStyles(styles)(CourseModListItems);
