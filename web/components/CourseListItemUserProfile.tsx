import React from "react";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "../Router";

const CourseListItemUserProfile = course => {
  return (
    <>
      <Link route="courses" params={{ id: course.id }} key={course.id}>
        <ListItem button>
          <ListItemText>
            <Typography variant="h6">{course.name}</Typography>
            <Typography variant="subtitle1">Professor Name</Typography>
          </ListItemText>
        </ListItem>
      </Link>
    </>
  );
};

export default CourseListItemUserProfile;
