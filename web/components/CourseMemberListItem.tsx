import React from "react";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { Clear } from "@material-ui/icons";

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

const CourseMemberListItem: React.SFC<IProps> = ({ user, removeCallback }) => {
  return (
    <ListItem button onClick={() => Router.pushRoute("users", { id: user.id })}>
      <ListItemAvatar>
        <ProfilePic user={user} />
      </ListItemAvatar>
      <ListItemText primary={user.name} />
      <ListItemSecondaryAction>
        <Tooltip title={`Remove ${user.name} from the class`}>
          <IconButton
            onClick={() => {
              removeCallback(user.id);
            }}
          >
            <Clear />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default CourseMemberListItem;
