import React from "react";
import { LinearProgress } from "@material-ui/core";
import ErrorMessage from "./ErrorMessage";

interface IProps {
  file_url: string;
  // TODO: syntax highlighting would be cool
  langauge?: string;
}

interface IState {
  loading: boolean;
  error: boolean;
  content?: string;
}

class TextFileViewer extends React.Component<IProps, IState> {
  static defaultProps = {
    langauge: "plain",
  };

  state = {
    loading: true,
    error: false,
    content: null,
  };

  async componentDidMount() {
    try {
      const resp = await fetch(this.props.file_url);
      const content = await resp.text();
      this.setState(state => ({ ...state, loading: false, content }));
    } catch (err) {
      console.warn(err);
      this.setState(state => ({ ...state, error: true }));
    }
  }

  render() {
    if (this.state.error) {
      return <ErrorMessage message="Failed to load the file..." />;
    }
    if (this.state.loading || !this.state.content) {
      return (
        <div>
          <LinearProgress />
        </div>
      );
    }

    return (
      <pre>
        <code>{this.state.content}</code>
      </pre>
    );
  }
}

export default TextFileViewer;
