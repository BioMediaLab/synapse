import React, { ChangeEvent } from "react";
import TextField from "@material-ui/core/TextField";
import { createStyles, withStyles, Button, Grid } from "@material-ui/core";

const styles = theme =>
  createStyles({
    main: {
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
      width: "90%",
    },
    field: {
      width: "100%",
    },
  });

interface IStyles {
  classes: {
    main: string;
    field: string;
  };
}

interface ITextEditProps {
  initialText: string;
  onSaveCallback: (newText: string) => void;
  title?: string;
  disabled?: boolean;
}

interface ITextEditState {
  textFieldValue: string;
  edited: boolean;
}

class BigTextFieldEdit extends React.Component<
  ITextEditProps & IStyles,
  ITextEditState
> {
  static defaultProps = {
    disabled: false,
    title: "",
  };

  constructor(props) {
    super(props);

    this.state = {
      textFieldValue: props.initialText,
      edited: false,
    };
  }

  componentWillReceiveProps(props: ITextEditProps) {
    if (props.initialText !== this.props.initialText) {
      this.setState(state => ({
        ...state,
        edited: false,
        textFieldValue: props.initialText,
      }));
    }
  }

  handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const textFieldValue = event.target.value;
    this.setState(state => ({
      ...state,
      edited: textFieldValue !== this.props.initialText,
      textFieldValue,
    }));
  };

  onSave = () => {
    if (this.state.edited) {
      this.props.onSaveCallback(this.state.textFieldValue);
      this.setState(state => ({
        ...state,
        edited: false,
      }));
    }
  };

  onCancel = () => {
    this.setState(state => ({
      ...state,
      edited: false,
      textFieldValue: this.props.initialText,
    }));
  };

  render() {
    return (
      <div className={this.props.classes.main}>
        <TextField
          variant="outlined"
          label={`${this.props.title}${this.state.edited ? "*" : ""}`}
          onChange={this.handleChange}
          value={this.state.textFieldValue}
          multiline
          className={this.props.classes.field}
          disabled={this.props.disabled}
        />
        <Grid container justify="flex-end" alignItems="flex-start">
          <Grid item>
            <Button
              onClick={this.onSave}
              disabled={!this.state.edited || this.props.disabled}
            >
              Save
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={this.onCancel} disabled={this.props.disabled}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(BigTextFieldEdit);
