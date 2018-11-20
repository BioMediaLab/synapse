import React from "react";
import withAuth from "../lib/withAuth";
import Typogrophy from "@material-ui/core/Typography";

const Calendar = () => (
  <div>
    <Typogrophy variant="h5">Calendar</Typogrophy>
  </div>
);

export default withAuth(Calendar);
