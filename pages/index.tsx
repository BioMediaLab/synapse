import React from "react";
import withAuth from "../lib/withAuth";
import UserSearch from "../components/UserSearch";
import Notifications from "../components/Notifications";

const Index = () => <div> <Notifications /> <UserSearch /> "Yaaaaargh!!!"</div>;

export default withAuth(Index);
