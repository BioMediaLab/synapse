import React, { Component } from "react";
import { withRouter, WithRouterProps } from "next/router";

import withAuth from "../lib/withAuth";
import FilePicker from "../components/FilePicker";

class Files extends Component<WithRouterProps> {
  render() {
    const courseId =
      typeof this.props.router.query.id === "string"
        ? this.props.router.query.id
        : this.props.router.query.id[0];
    return (
      <main>
        <FilePicker courseId={courseId} />
      </main>
    );
  }
}

export default withAuth(withRouter(Files));
