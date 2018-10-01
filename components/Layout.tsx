import React, { ReactNode } from "react";
import Login from "../components/Login";
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
