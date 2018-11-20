import React from "react";
import withAuth from "../lib/withAuth";
import Typogrophy from "@material-ui/core/Typography";

const Messages = () => (
  <div>
    <Typogrophy variant="h5">Messages</Typogrophy>
  </div>
);

export default withAuth(Messages);
