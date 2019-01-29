import React from "react";
import withAuth from "../lib/withAuth";
import Typogrophy from "@material-ui/core/Typography";
import CourseSearch from "../components/CourseSearch";

const Index = () => (
  <div>
    <Typogrophy variant="h5">Welcome to Synapse!</Typogrophy>
  </div>
);

export default withAuth(Index);
