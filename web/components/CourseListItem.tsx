import React, { Component } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import CourseModListItems from "./CourseModListItems";
import { Link } from "../Router";
import { createStyles, withStyles } from "@material-ui/core";
import { withRouter, WithRouterProps } from "next/router";

interface IProps {
  course: any;
  classes: {
    primary: string;
  };
}

const styles = createStyles(() => ({
  primary: {
    fontWeight: 500,
    color: "#036ADB",
  },
}));

class CourseListItem extends Component<IProps & WithRouterProps> {
  render() {
    const course = this.props.course;
    const activeLink = this.props.router.query.id === course.id;

    return (
      <>
        <Link
          prefetch
          route="courses"
          params={{ id: course.id }}
          key={course.id}
        >
          <ListItem button>
            <ListItemText
              primary={course.name}
              className={this.props.classes.primary}
            />
          </ListItem>
        </Link>
        <Collapse in={activeLink} timeout="auto" unmountOnExit>
          <CourseModListItems curCourseId={course.id} />
        </Collapse>
      </>
    );
  }
}

export default withStyles(styles)(withRouter(CourseListItem));
