import React from "react";
import Document, { Head, Main, NextScript } from "next/document";
import flush from "styled-jsx/server";
import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
import { ServerResponse } from "http";
import { addDays } from "date-fns";
import { parseCookie } from "../lib/handleSessions";

const serverConfig = getConfig();

interface IMyDocumentProps {
  pageContext: any;
}

class MyDocument extends Document<IMyDocumentProps> {
  render() {
    const { pageContext } = this.props;

    return (
      <html lang="en" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          {/* PWA primary color */}
          <meta
            name="theme-color"
            content={pageContext.theme.palette.primary.main}
          />
          <link rel="icon" type="image/png" href="/static/favicon.ico" />
          <style>
            {`
            html, body, #__next {
              height: 100%
            }`}
          </style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = async (ctx): Promise<any> => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.

  const doRedirect = (res: ServerResponse, path: string) => {
    res.writeHead(302, { Location: path });
    res.end();
  };

  if (ctx.pathname === "/finishLogin") {
    if (
      ctx.req.headers.cookie &&
      parseCookie(ctx.req.headers.cookie as any).session
    ) {
      // we already have the session, so we can redirect them to the main page.
      doRedirect(ctx.res, "/");
    } else {
      const code = ctx.query.code;
      if (!code) {
        // the code from google is not here, redirect them to the login page with an
        // error message.
        doRedirect(ctx.res, "/login?err=1");
      }

      // make a request to the api server to get a JWT.
      const resp = await fetch(
        `${serverConfig.publicRuntimeConfig.API_URL}auth/google/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({ code }),
        },
      );
      if (resp.status !== 200) {
        // an error ocurred on the api server when generating the JWT. redirect them to the login.
        doRedirect(ctx.res, "/login?err=1");
      } else {
        const result = await resp.json();
        const expDate = addDays(new Date(), 30).toUTCString();
        ctx.res.setHeader(
          "Set-Cookie",
          `session=${result.jwt}; Path=/; Expires=${expDate};`,
        );
        const destination = result.firstLogin ? "/?first=1" : "/";
        doRedirect(ctx.res, destination);
      }
    }
  }

  let pageContext;
  const page = ctx.renderPage(Component => {
    interface IWrappedComponentProps {
      pageContext: any;
      url: any;
    }

    const WrappedComponent: React.SFC<IWrappedComponentProps> = props => {
      pageContext = props.pageContext;
      return <Component {...props} />;
    };

    return WrappedComponent;
  });

  return {
    ...page,
    pageContext,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: (
      <React.Fragment>
        <style
          id="jss-server-side"
          dangerouslySetInnerHTML={{
            __html: pageContext.sheetsRegistry.toString(),
          }}
        />
        {flush() || null}
      </React.Fragment>
    ),
  };
};

export default MyDocument;
