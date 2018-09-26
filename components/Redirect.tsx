import React from "react";

interface RedirectProps {
  url: string
}

export default class Redirect extends React.Component<RedirectProps> {
  componentWillMount() {
    console.log("doing redirect,", this.props.url);
    location.href = this.props.url;
  }

  render() {
    return <div > redirecting... </div>;
  }
}
