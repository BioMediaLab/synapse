import React from "react";
import { Editor, EditorState } from "draft-js";

interface IEditorState {
  editorState: EditorState;
}

class TextEditor extends React.Component<{}, IEditorState> {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
  }

  handleInputChange = editorState => this.setState({ editorState });

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        onChange={this.handleInputChange}
      />
    );
  }
}

export default TextEditor;
