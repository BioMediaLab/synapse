import React from "react";
import { Editor, convertFromRaw, EditorState } from "draft-js";
import ErrorMessage from "./ErrorMessage";

interface IViewMessageProps {
  editorStateJson: string;
}

interface IViewMessageState {
  editorState: EditorState;
  error: boolean;
}

class RenderMessage extends React.Component<
  IViewMessageProps,
  IViewMessageState
> {
  constructor(props: IViewMessageProps) {
    super(props);

    try {
      const rawContent = JSON.parse(props.editorStateJson);
      this.state = {
        editorState: EditorState.createWithContent(convertFromRaw(rawContent)),
        error: false,
      };
    } catch (err) {
      console.warn(err);
      this.state = {
        editorState: EditorState.createEmpty(),
        error: true,
      };
    }
  }

  onEditorChange = newState => {
    this.setState(state => ({ ...state, editorState: newState }));
  };

  render() {
    return (
      <div>
        {this.state.error ? (
          <ErrorMessage message="Could not render message" />
        ) : (
          <Editor
            editorState={this.state.editorState}
            onChange={this.onEditorChange}
            readOnly
          />
        )}
      </div>
    );
  }
}

export default RenderMessage;
