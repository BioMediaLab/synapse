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

interface IErrorMessageFriendlyProps {
  message: any;
  success?: boolean;
  classes: {
    error: string;
    success: string;
    icon: string;
  };
}

interface IErrorMessageFriendlyState {
  open: boolean;
}

class ErrorMessageFriendly extends Component<
  IErrorMessageFriendlyProps,
  IErrorMessageFriendlyState
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
    if (!props.message || !props.message.message) return null;
    else
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
          {props.success ? (
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
          ) : (
            <SnackbarContent
              message={props.message.message.replace("GraphQL error: ", "")}
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
          )}
        </Snackbar>
      );
  }
}

export default withStyles(styles)(ErrorMessageFriendly);
