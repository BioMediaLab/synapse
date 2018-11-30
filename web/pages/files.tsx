import React, { Component } from "react";
import withAuth from "../lib/withAuth";

class Files extends Component {
  render() {
    return <div>Files</div>;
  }
}

export default withAuth(Files);
