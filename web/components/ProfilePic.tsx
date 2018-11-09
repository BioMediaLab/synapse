import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { string } from "prop-types";
import { any } from "async";

const styles = createStyles({
  avatar: {
    height: "30px",
    width: "30px",
  },
});

interface IProfilePicProps {
  classes: {
    avatar: string;
  };
  classesOverride: string;
  user: any;
}

const ProfilePic: React.SFC<IProfilePicProps> = ({
  classes,
  classesOverride,
  user,
  ...props
}) => {
  return user.photo ? (
    <Avatar
      className={classesOverride ? classesOverride : classes.avatar}
      src={user.photo}
      {...props}
    />
  ) : (
    <Avatar {...props}>{user.name.charAt(0).toUpperCase()}</Avatar>
  );
};

export default withStyles(styles)(ProfilePic);
