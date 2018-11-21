import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
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
    <Link route="courses" params={{ id: course.id }} key={course.id}>
      <Card style={Styles.Card}>
        <CardActionArea>
          <CardContent style={Styles.CardContent}>
            <Typography variant="title">{course.name}</Typography>
            <Typography variant="subheading">Professor Name</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};

export default CourseListItemUserProfile;
