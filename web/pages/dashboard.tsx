import React from "react";
import withAuth from "../lib/withAuth";
import Typogrophy from "@material-ui/core/Typography";

const Dashboard = () => (
  <div>
    <Typogrophy variant="h5">Dashboard</Typogrophy>
  </div>
);

export default withAuth(Dashboard);
