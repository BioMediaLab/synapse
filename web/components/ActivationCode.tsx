import React, { Component } from "react";
import {
  withStyles,
  createStyles,
  Theme,
  TextField,
  Button,
} from "@material-ui/core";
import {
  ACTIVATION_CODE_CREATE_MUTATION,
  ActivationCodeCreateMutation,
} from "../queries/courseQueries";

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
  newActivationCode: string;
}

class ActivationCode extends Component<
  IActivationCodeProps,
  IActivationCodeState
> {
  state = {
    activationCode: "",
    newActivationCode: "",
  };

  onSubmitChange = event => {
    const value: string = event.target.value;
    this.setState({
      activationCode: value,
    });
  };

  onCreateChange = event => {
    const value: string = event.target.value;
    this.setState({
      newActivationCode: value,
    });
  };

  render() {
    const classes = this.props.classes;
    return (
      <>
        <div>
          <TextField
            label="Activation Code"
            placeholder="****-****-****-****"
            className={classes.textField}
            fullWidth
            onChange={this.onSubmitChange}
          />
          <Button
            variant="contained"
            className={classes.button}
            onClick={this.onSubmitClick}
          >
            Submit
          </Button>
        </div>
        <div>
          <ActivationCodeCreateMutation
            mutation={ACTIVATION_CODE_CREATE_MUTATION}
          >
            {(doMutation, mutationResult) => {
              return (
                <>
                  <TextField
                    label="Create Activation Code"
                    placeholder="****-****-****-****"
                    className={classes.textField}
                    fullWidth
                    onChange={this.onCreateChange}
                    value={this.state.newActivationCode}
                  />

                  <Button
                    variant="contained"
                    className={classes.button}
                    onClick={event => {
                      doMutation({
                        variables: {
                          activation_code: this.state.newActivationCode,
                        },
                      });
                      if (mutationResult) {
                        console.log(
                          "Activation code",
                          this.state.newActivationCode,
                          "added to database!",
                        );
                        this.setState({ newActivationCode: "" });
                      }
                    }}
                  >
                    Create
                  </Button>
                </>
              );
            }}
          </ActivationCodeCreateMutation>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(ActivationCode);
