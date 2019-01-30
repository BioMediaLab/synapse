import React, { Component } from "react";
import { withRouter } from "next/router";

import withAuth from "../lib/withAuth";
import AddCourseUnitButton from "../components/AddCourseUnitButton";
import CourseUnitList from "../components/CourseUnitList";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { classExpression } from "babel-types";

const styles = createStyles({
  root: {
    maxWidth: "840px",
    margin: "auto",
  },
});

class Files extends Component<WithRouterProps> {
  render() {
    const courseId =
      typeof this.props.router.query.id === "string"
        ? this.props.router.query.id
        : this.props.router.query.id[0];

    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div style={{ marginBottom: "20px" }}>
          <AddCourseUnitButton courseId={courseId} />
        </div>

        <CourseUnitList courseId={courseId} />
      </div>
    );
  }
}

export default withAuth(withRouter(withStyles(styles)(Files)));
