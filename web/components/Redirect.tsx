import React from "react";

interface IRedirectProps {
  url: string;
}

export default class Redirect extends React.Component<IRedirectProps> {
  componentWillMount() {
    location.href = this.props.url;
  }

  render() {
    return <div />;
  }
}
