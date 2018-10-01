import React, { ReactNode } from "react";
import { withStyles, createStyles } from "@material-ui/core/styles";
import Header from "./Header";

const styles = theme =>
  createStyles({
    root: {
      flexGrow: 1,
      zIndex: 1,
      overflow: "hidden",
      position: "relative",
      display: "flex",
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing.unit * 3,
      minWidth: 0, // So the Typography noWrap works
    },
    toolbar: theme.mixins.toolbar,
  });

type Props = {
  children: ReactNode;
  classes: {
    root: string;
    toolbar: string;
    content: string;
  };
};

const Content: React.SFC<Props> = ({ classes, children }) => (
  <div className={classes.root}>
    <Header />
    <main className={classes.content}>
      <div className={classes.toolbar} />
      {children}
    </main>
  </div>
);

export default withStyles(styles)(Content);
