import React, { Component } from "react";
import withAuth from "../lib/withAuth";

class Quizzes extends Component {
  render() {
    return <div>Quizzes</div>;
  }
}

export default withAuth(Quizzes);
