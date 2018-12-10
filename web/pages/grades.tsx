import React, { Component } from "react";
import withAuth from "../lib/withAuth";

class Grades extends Component {
  render() {
    return <div>Grades</div>;
  }
}

export default withAuth(Grades);
