import React, { Component } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import CourseModListItems from "./CourseModListItems";
import { Link } from "../Router";

interface IProps {
  course: any;
}

interface IState {
  open: boolean;
}

class CourseListItem extends Component<IProps, IState> {
  state = {
    open: false,
  };
  handleClick = () => {
    this.state.open = !this.state.open;
    console.log(this.state.open);
  };

  render() {
    const course = this.props.course;
    return (
      <>
        <Link route="courses" params={{ id: course.id }} key={course.id}>
          <ListItem button onClick={this.handleClick}>
            <Avatar>{course.name.charAt(0).toUpperCase()}</Avatar>
            <ListItemText primary={course.name} />
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

export default CourseListItem;
