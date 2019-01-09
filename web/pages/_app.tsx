import React from "react";
import App, { Container } from "next/app";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import JssProvider from "react-jss/lib/JssProvider";
import getPageContext, { IPageContext } from "../lib/getPageContext";
import withApolloClient from "../lib/withApolloClient";
import { ApolloProvider } from "react-apollo";
import Meta from "../components/Meta";

interface IMyAppProps {
  Component: any;
  pageProps: any;
  apolloClient: any;
  hasSession: boolean | string;
}

interface IMyApp {
  pageContext: IPageContext;
  hasSession: boolean;
}

class IMyApp extends App<IMyAppProps> {
  static async getInitialProps(context) {
    const { Component, ctx } = context;
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  constructor(props) {
    super(props);
    this.pageContext = getPageContext();
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, apolloClient, hasSession } = this.props;
    return (
      <Container>
        <title>Synapse</title>
        <ApolloProvider client={apolloClient}>
          {/* Wrap every page in Jss and Theme providers */}
          <JssProvider
            registry={this.pageContext.sheetsRegistry}
            generateClassName={this.pageContext.generateClassName}
          >
            {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
            <MuiThemeProvider
              theme={this.pageContext.theme}
              sheetsManager={this.pageContext.sheetsManager}
            >
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server side. */}

              <Meta />

              <Component
                hasSession={hasSession}
                pageContext={this.pageContext}
                {...pageProps}
              />
            </MuiThemeProvider>
          </JssProvider>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApolloClient(IMyApp);
