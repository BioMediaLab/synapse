import React, { Component } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import CourseModListItems from "./CourseModListItems";
import { Link } from "../Router";
import { createStyles, withStyles } from "@material-ui/core";

interface IProps {
  course: any;
  classes: {
    primary: string;
  };
}

interface IState {
  open: boolean;
}

const styles = createStyles(theme => ({
  primary: {
    fontWeight: 500,
    color: "#036ADB",
  },
}));

class CourseListItem extends Component<IProps, IState> {
  state = {
    open: false,
  };
  handleClick = () => {
    this.state.open = !this.state.open;
  };

  render() {
    const course = this.props.course;

    return (
      <>
        <Link
          prefetch
          route="courses"
          params={{ id: course.id }}
          key={course.id}
        >
          <ListItem button onClick={this.handleClick}>
            <ListItemText
              primary={course.name}
              className={this.props.classes.primary}
            />
            {this.state.open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
        </Link>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <CourseModListItems />
        </Collapse>
      </>
    );
  }
}

export default withStyles(styles)(CourseListItem);
