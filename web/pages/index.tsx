import React from "react";
import withAuth from "../lib/withAuth";
import UserSearch from "../components/UserSearch";
import Notifications from "../components/Notifications";

const Index = () => (
  <div>
    <Notifications /> <UserSearch />
  </div>
);

export default withAuth(Index);
