import React from "react";
import Login from "../components/Login";
import Layout from "../components/Layout";

function withAuth(BaseComponent) {
  class withAuthWrapper extends React.Component {
    render() {
      if (!this.props.hasSession) return <Login />;

      return (
        <Layout>
          <BaseComponent {...this.props} />
        </Layout>
      );
    }
  }

  return withAuthWrapper;
}

export default withAuth;
