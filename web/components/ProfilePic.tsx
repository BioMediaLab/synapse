import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { createStyles, withStyles } from "@material-ui/core/styles";

const styles = createStyles({
  avatar: {
    height: "30px",
    width: "30px",
  },
  initials: {
    fontSize: "110%",
  },
});

interface IProfilePicProps {
  classes: {
    avatar: string;
    initials: string;
  };
  avatarClassOverride?: string;
  user: {
    name: string;
    photo: string | null;
  };
}

const ProfilePic: React.SFC<IProfilePicProps> = ({
  classes,
  avatarClassOverride,
  user,
  ...props
}) => {
  return user.photo ? (
    <Avatar
      alt={user.name}
      className={avatarClassOverride ? avatarClassOverride : classes.avatar}
      src={user.photo}
      {...props}
    />
  ) : (
    <Avatar alt={user.name} {...props}>
      <span className={classes.initials}>
        {user.name.charAt(0).toUpperCase()}
      </span>
    </Avatar>
  );
};

export default withStyles(styles)(ProfilePic);
