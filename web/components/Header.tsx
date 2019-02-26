import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  createStyles,
  withStyles,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";

import { Link, Router } from "../Router";
import SearchBar from "../components/SearchBar";
import CourseList from "./CourseList";
import { destroySessionFrontend } from "../lib/handleSessions";
import CurrentUserMenuItem from "./CurentUserMenuItem";

const drawerWidth = 300;

const styles = theme =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: "#2948FF",
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    mainIcon: {
      marginTop: "0.5rem",
    },
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex",
      },
    },
    drawerPaper: {
      position: "relative",
      width: drawerWidth,
      minHeight: "100vh",
      height: "100%",
      overflowX: "hidden",
    },
    toolbar: theme.mixins.toolbar,
    profilePicIconButton: {
      width: "48px",
      height: "48px",
    },
  });

interface IProps {
  classes: {
    root: string;
    appBar: string;
    grow: string;
    menuButton: string;
    mainIcon: string;
    inputRoot: string;
    inputInput: string;
    sectionDesktop: string;
    drawerPaper: string;
    toolbar: string;
    content: string;
    profilePicIconButton: string;
  };
}

interface IState {
  anchorEl: HTMLElement;
  open: boolean;
}

class PrimarySearchAppBar extends React.Component<IProps, IState> {
  state = {
    anchorEl: null,
    open: true,
  };

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  logout = () => {
    this.handleMobileMenuClose();
    destroySessionFrontend();
  };

  goToSettings = () => {
    this.handleMenuClose();
    Router.pushRoute("/settings");
  };

  goToAdmin = () => {
    Router.pushRoute("/admin");
  };

  handleMenuClick = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { anchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.goToSettings}>My Settings</MenuItem>
        <MenuItem onClick={this.logout}>Log Out</MenuItem>
      </Menu>
    );

    return (
      <>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleMenuClick}
            >
              <MenuIcon />
            </IconButton>

            <Link route="/">
              <a className={classes.mainIcon}>
                <img src="/static/synapse@2x.png" alt="Synapse" height="25px" />
              </a>
            </Link>

            <SearchBar />

            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <CurrentUserMenuItem />
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}

        {this.state.open ? (
          <Drawer
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.toolbar} />
            <CourseList />
          </Drawer>
        ) : null}
      </>
    );
  }
}

export default withStyles(styles)(PrimarySearchAppBar);
