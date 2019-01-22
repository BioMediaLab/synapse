import React, { Component } from "react";
import {
  withStyles,
  createStyles,
  Theme,
  TextField,
  Button,
} from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
    textField: {
      maxWidth: 400,
    },
    button: {
      margin: theme.spacing.unit,
    },
  });

interface IActivationCodeProps {
  classes: {
    textField: string;
    button: string;
  };
}

interface IActivationCodeState {
  activationCode: string;
}

class ActivationCode extends Component<
  IActivationCodeProps,
  IActivationCodeState
> {
  state = {
    activationCode: "",
  };

  onSubmitClick = event => {
    const value: string = event.target.value;

    this.setState({
      activationCode: value,
    });
  };

  render() {
    const classes = this.props.classes;
    return (
      <div>
        <TextField
          label="Activation Code"
          placeholder="****-****-****-****"
          className={classes.textField}
          fullWidth
        />
        <Button
          variant="contained"
          className={classes.button}
          onClick={this.onSubmitClick}
        >
          Submit
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(ActivationCode);
