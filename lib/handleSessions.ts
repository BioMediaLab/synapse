import Cookie from "js-cookie";

export const doWeRedirect = (req, res): void => {
  if (req.headers && req.headers.cookie) {
    console.log(req.headers.cookie);
  }
};

export const setSession = (jwt: string) => {
  Cookie.set("session", jwt);
};

export const getSessionFrontend = (): string => {
  return Cookie.get("session");
};

export const destroySession = () => {
  Cookie.remove("session");
}
