import React from "react";
import { SnackbarProvider } from "notistack";
import Login from "../components/Login";
import Layout from "../components/Layout";

interface IWithAuthProps {
  hasSession: string | boolean;
  pageContext: any;
}

function withAuth(BaseComponent) {
  class WithAuthWrapper extends React.Component<IWithAuthProps> {
    render() {
      if (!this.props.hasSession) {
        return <Login />;
      }

      return (
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Layout
            hasSession={this.props.hasSession}
            pageContext={this.props.pageContext}
          >
            <BaseComponent {...this.props} />
          </Layout>
        </SnackbarProvider>
      );
    }
  }

  return WithAuthWrapper;
}

export default withAuth;
