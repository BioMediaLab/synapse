import React from "react";
import initApollo from "./initApollo";
import Head from "next/head";
import { getDataFromTree } from "react-apollo";
import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import cookieParse from "cookie";
import { getSessionFrontend } from "./handleSessions";


interface Proc {
  browser: boolean,
}
declare var process: Proc;

export default App => {
  interface ApolloProps {
    apolloState: NormalizedCacheObject,
    hasSession: boolean,
  }

  interface Apollo extends React.Component<ApolloProps, {}> {
    apolloClient: ApolloClient<any>
  }

  class Apollo extends React.Component<ApolloProps, {}> {
    static displayName = "withApollo(App)";

    // Runs on server
    static async getInitialProps(ctx) {
      const { Component, router } = ctx;

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      let hasSession: boolean | string = false;
      if (ctx.ctx && ctx.ctx.req && ctx.ctx.res) {
        const { req, res } = ctx.ctx;
        const path = req.url;
        if (req.headers.cookie) {
          const cookie = cookieParse.parse(req.headers.cookie)
          if (cookie.session && cookie.session.length > 10) {
            hasSession = cookie.session;
          }
        }
        const pathMatch = new RegExp('/auth/google|/login|/finishLogin');
        if (!hasSession && !(pathMatch.test(path))) {
          res.writeHead(302, {
            Location: '/login',
          });
          res.end();
        }
      } else {
        const cookie = getSessionFrontend();
        if (cookie) {
          hasSession = cookie;
        }
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apollo = initApollo(hasSession);
      if (!process.browser) {
        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloClient={apollo}
            />
          );
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error("Error while running `getDataFromTree`", error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState,
        hasSession,
      };
    }

    constructor(props) {
      super(props);
      this.apolloClient = initApollo(props.hasSession, props.apolloState);
    }

    render() {
      return <App
        {...this.props}
        apolloClient={this.apolloClient}
      />;
    }
  };

  return Apollo;
};
