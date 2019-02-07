import React from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";

interface IEmailComposeState {
  editorState: EditorState;
}

class EmailCompose extends React.Component<{}, IEmailComposeState> {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  onEditorChange = editorState => {
    this.setState(state => ({
      ...state,
      editorState,
    }));
  };

  render() {
    return (
      <div>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onEditorChange}
        />
      </div>
    );
  }
}

export default EmailCompose;
