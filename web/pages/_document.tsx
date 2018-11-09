import React from "react";
import Document, { Head, Main, NextScript } from "next/document";
import flush from "styled-jsx/server";
import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
import nookies from "nookies";
import { ServerResponse } from "http";
import { addDays } from "date-fns";

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
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />
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

  const doRedirect = (res: ServerResponse, path) => {
    res.writeHead(302, { Location: path });
    res.end();
  };

  if (new RegExp("/finishLogin").test(ctx.pathname)) {
    if (nookies.get(ctx).session) {
      doRedirect(ctx.res, "/");
    } else {
      const code = ctx.query.code;
      if (!code) {
        doRedirect(ctx.res, "/login?err=1");
      }

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
        doRedirect(ctx.res, "/login?err=1");
      } else {
        const result = await resp.json();
        nookies.set(ctx, "session", result.jwt, {
          expires: addDays(new Date(), 30),
          sameSite: true,
          httpOnly: false, // maybe this can be set to true later
          path: "/",
        });
        doRedirect(ctx.res, "/?first=1");
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
