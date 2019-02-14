import React, { Component } from "react";
import {
  IconButton,
  Snackbar,
  SnackbarContent,
  withStyles,
} from "@material-ui/core";
import { green, amber } from "@material-ui/core/colors";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";
import CloseIcon from "@material-ui/icons/Close";

const styles = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  success: {
    backgroundColor: green[600],
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
});

interface ISnackbarMessageProps {
  message: any;
  success?: boolean;
  error?: boolean;
  info?: boolean;
  warning?: boolean;
  classes: {
    error: string;
    success: string;
    info: string;
    warning: string;
    icon: string;
    message: string;
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
    const classes = props.classes;

    var snackbarContent = <div />;
    if (!props.message) return null;
    else {
      if (props.error) {
        snackbarContent = (
          <SnackbarContent
            message={
              <span id="client-snackbar" className={classes.message}>
                <ErrorIcon className={classes.icon} />
                {props.message.message
                  ? props.message.message.replace("GraphQL error: ", "")
                  : props.message.replace("GraphQL error: ", "")}
              </span>
            }
            className={classes.error}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon className={classes.icon} />
              </IconButton>,
            ]}
          />
        );
      } else {
        snackbarContent = (
          <SnackbarContent
            message={
              <span id="client-snackbar" className={classes.message}>
                {props.success ? (
                  <CheckCircleIcon className={classes.icon} />
                ) : props.info ? (
                  <InfoIcon className={classes.icon} />
                ) : props.warning ? (
                  <WarningIcon className={classes.icon} />
                ) : null}
                {props.message}
              </span>
            }
            className={
              props.success
                ? classes.success
                : props.info
                ? classes.info
                : props.warning
                ? classes.warning
                : null
            }
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon className={classes.icon} />
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
