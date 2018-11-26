import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "../Router";

const Styles = {
  Card: {
    marginBottom: 20,
  },
  CardContent: {
    margin: 5,
  },
};

const CourseListItemUserProfile = course => {
  return (
    <>
      <Link route="courses" params={{ id: course.id }} key={course.id}>
        <ListItem button>
          <ListItemText>
            <Typography variant="title">{course.name}</Typography>
            <Typography variant="subheading">Professor Name</Typography>
          </ListItemText>
        </ListItem>
      </Link>
    </>
  );
};

export default CourseListItemUserProfile;
