import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { createStyles, withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import MoreIcon from "@material-ui/icons/MoreVert";
import Drawer from "@material-ui/core/Drawer";
import { Link, Router } from "../Router";
import SearchBar from "../components/SearchBar";
import CourseList from "./CourseList";
import Notifications from "./Notifications";
import { destroySessionFrontend } from "../lib/handleSessions";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ProfilePic from "../components/ProfilePic";

const GET_ME = gql`
  {
    me @client {
      isAdmin
      id
      name
      email
      photo
    }
  }
`;

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
      borderRight: "none",
      backgroundColor: "#FAFAFA",
    },
    toolbar: theme.mixins.toolbar,
    profilePicIconButton: {
      width: "48px",
      height: "48px",
    },
    profilePicIconButtonMobile: {
      width: "24px",
      height: "24px",
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
    sectionMobile: string;
    drawerPaper: string;
    toolbar: string;
    content: string;
    profilePicIconButton: string;
    profilePicIconButtonMobile: string;
  };
}

interface IState {
  anchorEl: HTMLElement;
  mobileMoreAnchorEl: HTMLElement;
  open: boolean;
}

class PrimarySearchAppBar extends React.Component<IProps, IState> {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
    open: true,
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

  handleMenuClick = () => {
    this.setState({ open: !this.state.open });
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
        <MenuItem onClick={this.goToSettings}>My Settings</MenuItem>
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
        <Query query={GET_ME}>
          {({ loading, error, data }) => {
            if (loading || error) {
              return (
                <MenuItem>
                  <IconButton
                    aria-owns={isMenuOpen ? "material-appbar" : null}
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                </MenuItem>
              );
            }

            return (
              <Link route="users" params={{ id: data.me.id }} key={data.me.id}>
                <MenuItem>
                  <IconButton
                    aria-owns={isMenuOpen ? "material-appbar" : null}
                    aria-haspopup="true"
                    color="inherit"
                    className={classes.profilePicIconButtonMobile}
                  >
                    <ProfilePic
                      user={data.me}
                      classesOverride={classes.profilePicIconButtonMobile}
                    />
                  </IconButton>
                  <p>My Profile</p>
                </MenuItem>
              </Link>
            );
          }}
        </Query>

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

            <Link href="/">
              <a className={classes.mainIcon}>
                <img src="/static/synapse@2x.png" alt="Synapse" height="25px" />
              </a>
            </Link>

            <SearchBar />

            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <Notifications />
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton>
              <Query query={GET_ME}>
                {({ loading, error, data }) => {
                  if (loading || error) {
                    return (
                      <IconButton
                        aria-owns={isMenuOpen ? "material-appbar" : null}
                        aria-haspopup="true"
                        onClick={this.handleProfileMenuOpen}
                        color="inherit"
                      >
                        <AccountCircle />
                      </IconButton>
                    );
                  }

                  return (
                    <IconButton
                      aria-owns={isMenuOpen ? "material-appbar" : null}
                      aria-haspopup="true"
                      onClick={this.handleProfileMenuOpen}
                      color="inherit"
                      className={classes.profilePicIconButton}
                      style={{ padding: 0 }}
                    >
                      <ProfilePic user={data.me} />
                    </IconButton>
                  );
                }}
              </Query>
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
