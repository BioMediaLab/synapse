import React from "react";
import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import {
  withStyles,
  createStyles,
  Theme,
  Grid,
  Paper,
  TextField,
  Button,
  IconButton,
} from "@material-ui/core";
import { FormatBold, FormatItalic, FormatUnderlined } from "@material-ui/icons";

class StyleControl extends React.Component<{
  onSelect: (variant: string) => void;
  variant: string;
  icon: any;
  selected: boolean;
  disabled?: boolean;
}> {
  static defaultProps = {
    disabled: false,
  };

  // Have to use onMouseDown instead of onClick or the editor will lose focus
  handleMouseDown = event => {
    event.preventDefault();
    this.props.onSelect(this.props.variant);
  };

  render() {
    return (
      <IconButton
        color={this.props.selected ? "secondary" : "default"}
        onMouseDown={this.handleMouseDown}
        disabled={this.props.disabled}
      >
        {this.props.icon}
      </IconButton>
    );
  }
}

const styles = createStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing.unit,
  },
  editorSection: {
    backgroundColor: theme.palette.grey["200"],
  },
  editorMain: {
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit,
    minHeight: theme.spacing.unit * 20,
  },
  titleTextField: {
    marginLeft: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    width: "90%",
  },
  controls: {
    borderStyle: "solid",
    borderColor: theme.palette.grey["200"],
    borderWidth: theme.spacing.unit,
    borderTopLeftRadius: theme.spacing.unit * 2,
    borderTopRightRadius: theme.spacing.unit * 2,
    padding: theme.spacing.unit,
  },
}));

interface IProps {
  onSaveCallback: (title: string, body: any) => void;
  onCancelCallback: () => void;
  saveButtonText?: string;
  classes: {
    editorMain: string;
    editorSection: string;
    titleTextField: string;
    controls: string;
    root: string;
  };
}

interface IState {
  editorState: EditorState;
  title: string;
  bold: boolean;
  italic: boolean;
  underlined: boolean;
  hasFocus: boolean;
}

class WriteMessage extends React.Component<IProps, IState> {
  static defaultProps = {
    saveButtonText: "Save",
  };

  state = {
    editorState: EditorState.createEmpty(),
    title: "",
    bold: false,
    italic: false,
    underlined: false,
    hasFocus: false,
  };

  focus = () => {
    (this.refs.editor as any).focus();
  };

  onTitleStateChange = event => {
    const title = event.target.value;
    this.setState(state => ({ ...state, title }));
  };

  onEditorStateChange = editorState => {
    this.setState(state => ({ ...state, editorState }));
  };

  handleEditorKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onEditorStateChange(newState);
      switch (command) {
        case "bold":
          this.setState(state => ({ ...state, bold: !state.bold }));
          break;
        case "italic":
          this.setState(state => ({ ...state, italic: !state.italic }));
          break;
        case "underline":
          this.setState(state => ({ ...state, underlined: !state.underlined }));
          break;
      }
      return "handled";
    }
    return "not-handled";
  };

  onEditorTabKeyPressed = event => {
    event.preventDefault();
  };

  onInlineStyleClick = (style: string) => {
    this.onEditorStateChange(
      RichUtils.toggleInlineStyle(this.state.editorState, style),
    );
    switch (style) {
      case "BOLD":
        this.setState(state => ({ ...state, bold: !state.bold }));
        break;
      case "ITALIC":
        this.setState(state => ({ ...state, italic: !state.italic }));
        break;
      case "UNDERLINE":
        this.setState(state => ({ ...state, underlined: !state.underlined }));
        break;
      default:
        throw new Error(`unknown inline style type ${style}`);
    }
  };

  resetState = () => {
    this.setState(state => ({
      ...state,
      editorState: EditorState.createEmpty(),
      title: "",
      bold: false,
      italic: false,
      underlined: false,
    }));
  };

  onSave = () => {
    const curContent = this.state.editorState.getCurrentContent();
    this.props.onSaveCallback(this.state.title, convertToRaw(curContent));
    this.resetState();
  };

  onCancel = () => {
    this.props.onCancelCallback();
    this.resetState();
  };

  render() {
    return (
      <Grid container direction="column" className={this.props.classes.root}>
        <Grid item>
          <Grid
            container
            className={this.props.classes.controls}
            justify="space-between"
          >
            <Grid item>
              <Grid container>
                <StyleControl
                  variant="BOLD"
                  icon={<FormatBold />}
                  onSelect={this.onInlineStyleClick}
                  selected={this.state.bold}
                  disabled={!this.state.hasFocus}
                />
                <StyleControl
                  variant="ITALIC"
                  icon={<FormatItalic />}
                  onSelect={this.onInlineStyleClick}
                  selected={this.state.italic}
                  disabled={!this.state.hasFocus}
                />
                <StyleControl
                  variant="UNDERLINE"
                  icon={<FormatUnderlined />}
                  onSelect={this.onInlineStyleClick}
                  selected={this.state.underlined}
                  disabled={!this.state.hasFocus}
                />
              </Grid>
            </Grid>
            <Grid item>
              <Grid container>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.onSave}
                  disabled={this.state.title.length <= 1}
                >
                  {this.props.saveButtonText}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.onCancel}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={this.props.classes.editorSection}>
          <Paper className={this.props.classes.editorMain} onClick={this.focus}>
            <TextField
              className={this.props.classes.titleTextField}
              value={this.state.title}
              onChange={this.onTitleStateChange}
              label="Title"
              fullWidth
              onClick={e => e.stopPropagation()}
              required
            />
            <Editor
              editorState={this.state.editorState}
              onChange={this.onEditorStateChange}
              handleKeyCommand={this.handleEditorKeyCommand}
              onTab={this.onEditorTabKeyPressed}
              ref="editor"
              spellCheck
              placeholder="Type your message..."
              onFocus={() =>
                this.setState(state => ({ ...state, hasFocus: true }))
              }
              onBlur={() =>
                this.setState(state => ({ ...state, hasFocus: false }))
              }
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(WriteMessage);
