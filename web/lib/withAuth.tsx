import React from "react";
import Login from "../components/Login";
import Layout from "../components/Layout";

interface IWithAuthProps {
  hasSession: string | boolean;
}

function withAuth(BaseComponent) {
  class WithAuthWrapper extends React.Component<IWithAuthProps> {
    public render() {
      if (!this.props.hasSession) {
        return <Login />;
      }

      return (
        <Layout>
          <BaseComponent {...this.props} />
        </Layout>
      );
    }
  }

  return WithAuthWrapper;
}

export default withAuth;
