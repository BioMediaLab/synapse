import BrowserCookies from "js-cookie";
import cookieParse from "cookie";

export const getSessionCookie = (ctx): boolean | string => {
  if (ctx.ctx.req) {
    // we are on the server
    const { req } = ctx.ctx;
    if (req.headers.cookie) {
      const cookie = cookieParse.parse(req.headers.cookie);
      if (cookie.session && cookie.session.length > 10) {
        return cookie.session;
      }
    }
  } else {
    // we are on the client
    const cookie = BrowserCookies.get("session");
    if (cookie) {
      return cookie;
    }
  }

  // we don't have a cookie at all
  return false;
};

const redirectServer = (ctx) => {
  if (ctx.ctx && ctx.ctx.req && ctx.ctx.res) {
    const { ctx: { req, res, } } = ctx;
    const path = req.url;
    const pathMatch = new RegExp("/auth/google|/login|/finishLogin");
    if (!pathMatch.test(path)) {
      res.writeHead(302, {
        Location: "/login"
      });
      res.end();
    }
  } else {
    throw new Error("redirectServer is running in the browser");
  }
};

const redirectClient = () => {
  const pathMatch = new RegExp("/auth/google|/login|/finishLogin");
  if (!pathMatch.test(window.location.pathname)) {
    window.location = `${window.location.protocol}//${window.location.host}/login` as any;
  }
}

export const doWeRedirect = (ctx): void => {
  if (!getSessionCookie(ctx)) {
    if (ctx.ctx.req) {
      redirectServer(ctx);
    } else {
      redirectClient();
    }
  }
};

export const setSessionFrontend = (jwt: string) => {
  BrowserCookies.set("session", jwt);
};

export const getSessionFrontend = (): string => {
  return BrowserCookies.get("session");
};

export const destroySessionFrontend = () => {
  BrowserCookies.remove("session");
}

