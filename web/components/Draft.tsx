import React from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import Paper from "@material-ui/core/Paper";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const CREATE_COURSE_MESSAGE = gql`
  mutation CreateCourseMessage($body: String!, $course_id: String!) {
    createCourseMessage(body: $body, course_id: $course_id) {
      id
    }
  }
`;

interface IEditorState {
  editorState: EditorState;
}

class Draft extends React.Component<{}, IEditorState> {
  editor: any;

  state = {
    editorState: EditorState.createEmpty(),
  };

  constructor(props) {
    super(props);
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

  handleInputChange = editorState => this.setState({ editorState }); // || console.log(editorState);

  handleKeyPress = () => {
    console.log("test");
  };

  render() {
    return (
      <Paper>
        <div
          style={{
            minHeight: "44px",
            fontSize: "22px",
            padding: "20px",
          }}
        >
          <Mutation mutation={CREATE_COURSE_MESSAGE}>
            {(createCourseMessage, { data }) => (
              <Editor
                ref={this.setEditor}
                editorState={this.state.editorState}
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
                placeholder="Message class"
              />
            )}
          </Mutation>
        </div>
      </Paper>
    );
  }
}

export default Draft;
