import React from "react";
import { ListItem, ListItemText, ListItemAvatar } from "@material-ui/core";
import { Router } from "../Router";
import ProfilePic from "./ProfilePic";

interface IProps {
  admin: boolean;
  removeCallback: (id: string) => void;
  user: {
    name: string;
    email: string;
    id: string;
    photo: string;
  };
}

const CourseMemberListItem: React.SFC<IProps> = ({ user }) => {
  return (
    <ListItem button onClick={() => Router.pushRoute("users", { id: user.id })}>
      <ListItemAvatar>
        <ProfilePic user={user} />
      </ListItemAvatar>
      <ListItemText primary={user.name} />
    </ListItem>
  );
};

export default CourseMemberListItem;
