import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { createStyles, withStyles } from "@material-ui/core/styles";

const styles = createStyles({
  avatar: {
    height: "30px",
    width: "30px",
  },
  avatar40: {
    height: "50px",
    width: "50px",
  },
  initials: {
    fontSize: "110%",
  },
});

interface IProfilePicProps {
  classes: {
    avatar: string;
    avatar40: string;
    initials: string;
  };
  classesOverride?: boolean;
  user: {
    name: string;
    photo: string | null;
  };
}

const ProfilePic: React.SFC<IProfilePicProps> = ({
  classes,
  classesOverride,
  user,
  ...props
}) => {
  return user.photo ? (
    <Avatar
      alt={user.name}
      className={classesOverride ? classes.avatar40 : classes.avatar}
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
