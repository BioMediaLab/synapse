import React, { Component } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { withStyles, createStyles } from "@material-ui/core/styles";
import { classExpression } from "babel-types";

const styles = createStyles({
  link: {
    textDecoration: "none",
  },
});

const ITEM_HEIGHT = 48;

class ContentListItemVertMenu extends Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    const { classes, contentPiece } = this.props;

    return (
      <ListItemSecondaryAction>
        <IconButton
          aria-label="More"
          aria-owns={open ? "long-menu" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 200,
            },
          }}
        >
          <MenuItem key={1} onClick={this.handleClose}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText inset primary="Settings" />
          </MenuItem>

          <a
            href={`${contentPiece.url}?dl=true`}
            target="_blank"
            className={classes.link}
          >
            <MenuItem>
              <ListItemIcon>
                <DownloadIcon />
              </ListItemIcon>
              <ListItemText inset primary="Download" />
            </MenuItem>
          </a>
        </Menu>
      </ListItemSecondaryAction>
    );
  }
}

export default withStyles(styles)(ContentListItemVertMenu);
