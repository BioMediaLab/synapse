import React from "react";
import withAuth from "../lib/withAuth";
import UserSearch from "../components/UserSearch";

const Index = () => <div> <UserSearch /> "Yaaaaargh!!!"</div>;

export default withAuth(Index);
