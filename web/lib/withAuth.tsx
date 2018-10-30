import React from "react";
import { SnackbarProvider } from "notistack";
import Login from "../components/Login";
import Layout from "../components/Layout";

interface IWithAuthProps {
  hasSession: string | boolean;
}

function withAuth(BaseComponent) {
  class WithAuthWrapper extends React.Component<IWithAuthProps> {
    render() {
      if (!this.props.hasSession) {
        return <Login />;
      }

      return (
        <SnackbarProvider maxSnack={3}>
          <Layout>
            <BaseComponent {...this.props} />
          </Layout>
        </SnackbarProvider>
      );
    }
  }

  return WithAuthWrapper;
}

export default withAuth;
