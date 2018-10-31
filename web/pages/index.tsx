import React from "react";
import withAuth from "../lib/withAuth";

const Index = () => <div>Welcome to Synapse!</div>;

export default withAuth(Index);
