import React, { ChangeEvent } from "react";
import EditIcon from "@material-ui/icons/Edit";
import {
  createStyles,
  withStyles,
  Button,
  Grid,
  Typography,
  IconButton,
  TextField,
  Tooltip,
} from "@material-ui/core";

const styles = theme =>
  createStyles({
    editMain: {
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
      width: "90%",
    },
    mainMain: {
      padding: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 2,
      width: "90%",
    },
    notEditingBodyText: {
      paddingLeft: theme.spacing.unit,
      paddingTop: theme.spacing.unit,
    },
    field: {
      width: "100%",
    },
  });

interface IStyles {
  classes: {
    editMain: string;
    mainMain: string;
    field: string;
    notEditingBodyText: string;
  };
}

interface ITextEditProps {
  initialText: string;
  onSaveCallback: (newText: string) => void;
  title?: string;
  disabled?: boolean;
  nonEditingTextFieldVariant?: string;
}

interface IState {
  textFieldValue: string;
  edited: boolean;
  doingEdits: boolean;
}

type Props = ITextEditProps & IStyles;

class BigTextFieldEdit extends React.Component<Props, IState> {
  static defaultProps = {
    disabled: false,
    title: "",
    nonEditingTextFieldVariant: "body1",
  };

  state = {
    textFieldValue: this.props.initialText,
    edited: false,
    doingEdits: false,
  };

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
        doingEdits: false,
      }));
    }
  };

  onCancel = () => {
    this.setState(state => ({
      ...state,
      edited: false,
      textFieldValue: this.props.initialText,
      doingEdits: false,
    }));
  };

  startEditing = () => {
    this.setState(state => ({
      ...state,
      doingEdits: true,
    }));
  };

  render() {
    if (this.state.doingEdits) {
      return (
        <div className={this.props.classes.editMain}>
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
            <Button onClick={this.onCancel} disabled={this.props.disabled}>
              Cancel
            </Button>
            <Button
              onClick={this.onSave}
              disabled={!this.state.edited || this.props.disabled}
              color="primary"
            >
              Save
            </Button>
          </Grid>
        </div>
      );
    }
    return (
      <div className={this.props.classes.mainMain}>
        <Typography variant="caption">{this.props.title}</Typography>
        <div className={this.props.classes.notEditingBodyText}>
          <Typography variant={this.props.nonEditingTextFieldVariant as any}>
            {/* TODO: fix this cast ^^^ */}
            {this.state.textFieldValue}
          </Typography>
        </div>
        <Grid container justify="flex-end">
          <Tooltip title={`Edit ${this.props.title}`}>
            <div>
              <IconButton
                onClick={this.startEditing}
                disabled={this.props.disabled}
              >
                <EditIcon />
              </IconButton>
            </div>
          </Tooltip>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(BigTextFieldEdit);
