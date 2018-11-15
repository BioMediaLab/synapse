import React from "react";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { Remove } from "@material-ui/icons";

import { Router } from "../Router";
import ProfilePic from "./ProfilePic";

interface IProps {
  admin: boolean;
  courseId: string;
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
      <ListItemSecondaryAction>
        <Tooltip title={`Remove ${user.name} from the class`}>
          <IconButton>
            <Remove />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default CourseMemberListItem;
