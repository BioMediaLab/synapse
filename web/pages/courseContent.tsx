import React, { Component } from "react";
import { withRouter, WithRouterProps } from "next/router";

import withAuth from "../lib/withAuth";
import AddCourseUnitButton from "../components/AddCourseUnitButton";
import CourseUnitList from "../components/CourseUnitList";

class Files extends Component<WithRouterProps> {
  render() {
    const courseId =
      typeof this.props.router.query.id === "string"
        ? this.props.router.query.id
        : this.props.router.query.id[0];
    return (
      <div>
        <AddCourseUnitButton courseId={courseId} />

        <CourseUnitList courseId={courseId} />
      </div>
    );
  }
}

export default withAuth(withRouter(Files));
