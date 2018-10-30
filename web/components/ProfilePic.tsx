import React from "react";
import Avatar from "@material-ui/core/Avatar";

export default ({ user, ...props }) =>
  user.photo ? (
    <Avatar src={user.photo} {...props} />
  ) : (
    <Avatar {...props}>{user.name.charAt(0).toUpperCase()}</Avatar>
  );
