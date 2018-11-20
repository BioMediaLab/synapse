import React from "react";
import withAuth from "../lib/withAuth";
import Typogrophy from "@material-ui/core/Typography";

const Notifications = () => (
  <div>
    <Typogrophy variant="h5">Notifications</Typogrophy>
  </div>
);

export default withAuth(Notifications);
