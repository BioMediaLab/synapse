import React from "react";
import withAuth from "../lib/withAuth";
import Typogrophy from "@material-ui/core/Typography";
import Reminders from "../components/Reminders";

const Calendar = () => (
  <div>
    <Typogrophy variant="h5">Calendar</Typogrophy>
    <Reminders />
  </div>
);

export default withAuth(Calendar);
