import React, { ReactNode } from "react";
import Content from "./Content";

type Props = {
  children: ReactNode;
};

class Layout extends React.Component<Props> {
  render() {
    return <Content>{this.props.children}</Content>;
  }
}

export default Layout;
