import React from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import Paper from "@material-ui/core/Paper";

interface IEditorState {
  editorState: EditorState;
  editor: Editor;
}

class Draft extends React.Component<{}, IEditorState> {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.editor = null;
  }

  componentDidMount() {
    this.focusEditor();
  }

  setEditor = editor => {
    this.editor = editor;
  };

  focusEditor = () => {
    if (this.editor) {
      this.editor.focus();
    }
  };

  handleInputChange = editorState =>
    this.setState({ editorState }) || console.log(editorState);

  render() {
    return (
      <Paper>
        <div
          style={{
            minHeight: "44px",
            fontSize: "22px",
            padding: "20px",
            fontFamily: "Roboto",
          }}
        >
          <Editor
            ref={this.setEditor}
            editorState={this.state.editorState}
            onChange={this.handleInputChange}
            placeholder="📢 Send an announcement..."
          />
        </div>
      </Paper>
    );
  }
}

export default Draft;
