import React from "react";

interface RedirectProps {
  url: string;
}

export default class Redirect extends React.Component<RedirectProps> {
  componentWillMount() {
    location.href = this.props.url;
  }

  render() {
    return <div />;
  }
}
