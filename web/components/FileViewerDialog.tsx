import React, { Component } from "react";
import { withStyles, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import FileViewer from "react-file-viewer";
import Checkbox from "@material-ui/core/Checkbox";

import ContentListItemVertMenu from "./ContentListItemVertMenu";

const styles = createStyles({
  appBar: {
    position: "relative",
  },
  flex: {
    flex: 1,
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}
class FileViewerDialog extends Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, contentPiece } = this.props;

    return (
      <div>
        <ListItem button key={contentPiece.id}>
          <Checkbox checked={0} tabIndex={-1} disableRipple />

          <ListItemText
            primary={contentPiece.name}
            onClick={this.handleClickOpen}
          >
            {contentPiece.name}
          </ListItemText>

          <ContentListItemVertMenu contentPiece={contentPiece} />
        </ListItem>

        <Dialog
          fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                onClick={this.handleClose}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                {contentPiece.name}
              </Typography>
              <Button color="inherit" onClick={this.handleClose}>
                Download
              </Button>
            </Toolbar>
          </AppBar>

          <FileViewer
            fileType={contentPiece.type.slice(
              contentPiece.type.indexOf("/") + 1,
            )}
            filePath={contentPiece.url}
            onError={error => console.log("freakin error dude", error)}
          />
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(FileViewerDialog);
