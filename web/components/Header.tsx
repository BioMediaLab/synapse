import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { createStyles, withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import MoreIcon from "@material-ui/icons/MoreVert";
import Drawer from "@material-ui/core/Drawer";
import Link from "next/link";
import SearchBar from "../components/SearchBar";

import CourseList from "./CourseList";
import Notifications from "./Notifications";
import { destroySessionFrontend } from "../lib/handleSessions";
import { Router } from "../Router";

const drawerWidth = 300;

const styles = theme =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing.unit * 2,
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing.unit * 3,
        width: "auto",
      },
    },
    searchIcon: {
      width: theme.spacing.unit * 9,
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    drawerPaper: {
      position: "relative",
      width: drawerWidth,
      height: "100vh",
    },
    toolbar: theme.mixins.toolbar,
  });

interface Props {
  classes: {
    root: string;
    appBar: string;
    grow: string;
    menuButton: string;
    search: string;
    searchIcon: string;
    mainIcon: string;
    inputRoot: string;
    inputInput: string;
    sectionDesktop: string;
    sectionMobile: string;
    drawerPaper: string;
    toolbar: string;
    content: string;
  };
}

interface State {
  anchorEl: HTMLElement;
  mobileMoreAnchorEl: HTMLElement;
}

class PrimarySearchAppBar extends React.Component<Props, State> {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  };

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  logout = () => {
    this.handleMobileMenuClose();
    destroySessionFrontend();
  };

  goToSettings = () => {
    this.handleMenuClose();
    Router.pushRoute("/settings");
  };

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.goToSettings}>My account</MenuItem>
        <MenuItem onClick={this.logout}>Log Out</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <Notifications />
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
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
            >
              <MenuIcon />
            </IconButton>

            <Link href="/">
              <a className={classes.mainIcon}>
                <img src="/static/synapse@2x.png" alt="Synapse" height="25px" />
              </a>
            </Link>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <SearchBar />
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <Notifications />
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                aria-owns={isMenuOpen ? "material-appbar" : null}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

        {renderMenu}
        {renderMobileMenu}

        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.toolbar} />
          <CourseList />
        </Drawer>
      </>
    );
  }
}

export default withStyles(styles)(PrimarySearchAppBar);
