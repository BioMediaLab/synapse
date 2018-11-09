import BrowserCookies from "js-cookie";
import { NextAppContext } from "next/app";

export const parseCookie = (
  cookieString: string,
): { [key: string]: string } => {
  const splitsCookieParts = cookieString.split("=");
  if (splitsCookieParts.length === 0 || splitsCookieParts.length % 2 !== 0) {
    return {};
  }

  const keyValGroups: string[][] = [];
  splitsCookieParts.forEach((part, index, arr) => {
    if (index % 2 === 0) {
      keyValGroups.push([part, arr[index + 1]]);
    }
  });

  const result = Object.create({});
  keyValGroups.forEach(([name, val]) => {
    result[name] = val;
  });
  return result;
};

export const getSessionCookie = (ctx: NextAppContext): boolean | string => {
  let session: boolean | string = false;
  if (ctx.ctx.req && ctx.ctx.req.headers && ctx.ctx.req.headers.cookie) {
    let cookieData = ctx.ctx.req.headers.cookie;
    if (typeof cookieData === "object") {
      cookieData = cookieData[0];
    }
    const cookies = parseCookie(cookieData);
    if (cookies.session) {
      session = cookies.session;
    }
  } else if (!ctx.ctx.req) {
    const cookies = parseCookie(document.cookie);
    if (cookies.session) {
      session = cookies.session;
    }
  }
  return session;
};

const redirectServer = (ctx: NextAppContext) => {
  if (ctx.ctx && ctx.ctx.req && ctx.ctx.res) {
    const {
      ctx: { req, res },
    } = ctx;
    const path = req.url;
    const pathMatch = new RegExp("/auth/google|/login");
    if (!pathMatch.test(path)) {
      res.writeHead(302, {
        Location: "/login",
      });
      res.end();
    }
  } else {
    throw new Error("redirectServer is running in the browser");
  }
};

const redirectClient = () => {
  window.location = `/` as any;
};

export const doWeRedirect = (ctx): void => {
  if (!getSessionCookie(ctx)) {
    if (ctx.ctx.req) {
      redirectServer(ctx);
    } else {
      redirectClient();
    }
  }
};

export const getSessionFrontend = (): string | null => {
  return BrowserCookies.get("session");
};

export const destroySessionFrontend = () => {
  BrowserCookies.remove("session");
  redirectClient();
};
