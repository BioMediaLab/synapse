import React, { ReactNode } from "react";
import Content from "./Content";

interface ILayoutProps {
  children: ReactNode;
  hasSession?: string | boolean;
  pageContext: any;
}

class Layout extends React.Component<ILayoutProps> {
  render() {
    return <Content>{this.props.children}</Content>;
  }
}

export default Layout;
