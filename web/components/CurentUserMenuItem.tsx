import React from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Drawer,
  createStyles,
  withStyles,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  AccountCircle,
  Mail as MailIcon,
  MoreVert as MoreIcon,
  Settings as AdminIcon,
} from "@material-ui/icons";
import ProfilePic from "./ProfilePic";

const currentUserMenuItem = () => {
  const { user, error } = useCurrentUser();

  if (user == null) {
    return (
      <>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <IconButton aria-haspopup="true" color="inherit">
          <AccountCircle />
        </IconButton>
      </>
    );
  }

  return (
    <>
      <IconButton color="inherit">
        <Badge badgeContent={4} color="secondary">
          <MailIcon />
        </Badge>
      </IconButton>
      <IconButton aria-haspopup="true" color="inherit" style={{ padding: 0 }}>
        <ProfilePic user={user} classesOverride />
      </IconButton>
    </>
  );
};

export default currentUserMenuItem;
