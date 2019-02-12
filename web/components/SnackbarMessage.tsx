import React, { Component } from "react";
import {
  IconButton,
  Snackbar,
  SnackbarContent,
  withStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import green from "@material-ui/core/colors/green";

const styles = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  success: {
    backgroundColor: green[600],
  },
  icon: {
    fontSize: 20,
  },
});

interface ISnackbarMessageProps {
  message: any;
  success?: boolean;
  error?: boolean;
  classes: {
    error: string;
    success: string;
    icon: string;
  };
}

interface ISnackbarMessageState {
  open: boolean;
}

class SnackbarMessage extends Component<
  ISnackbarMessageProps,
  ISnackbarMessageState
> {
  state = {
    open: true,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.message != this.props.message) {
      this.setState({ open: true });
    }
  }

  handleClose = event => {
    this.setState({ open: false });
  };

  render() {
    const props = this.props;
    var snackbarContent = <div />;
    if (!props.message || !props.message.message) return null;
    else {
      if (props.success) {
        snackbarContent = (
          <SnackbarContent
            message={props.message}
            className={props.classes.success}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon className={props.classes.icon} />
              </IconButton>,
            ]}
          />
        );
      } else if (props.error) {
        snackbarContent = (
          <SnackbarContent
            message={
              props.message.message
                ? props.message.message.replace("GraphQL error: ", "")
                : props.message.replace("GraphQL error: ", "")
            }
            className={props.classes.error}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon className={props.classes.icon} />
              </IconButton>,
            ]}
          />
        );
      }
      return (
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          {snackbarContent}
        </Snackbar>
      );
    }
  }
}

export default withStyles(styles)(SnackbarMessage);
