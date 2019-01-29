import React, { Component } from "react";
import withAuth from "../lib/withAuth";
import { withRouter, WithRouterProps } from "next/router";
import QuestionBlocksBrowser from "../components/QuestionBlocksBrowser";

class Grades extends Component<WithRouterProps> {
  render() {
    return (
      <div>
        Grades
        <QuestionBlocksBrowser courseId={this.props.router.query.id as any} />
      </div>
    );
  }
}

export default withAuth(withRouter(Grades));
