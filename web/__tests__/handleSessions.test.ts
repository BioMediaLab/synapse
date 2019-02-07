import { parseCookie, destroySessionFrontend } from "../lib/handleSessions";
import BrowserCookies, { CookiesStatic } from "js-cookie";

test("remove a cookie from the front end", () => {
  destroySessionFrontend();
  // to work with mocked types in Jest + TS
  const bcookies: jest.Mocked<CookiesStatic> = BrowserCookies as any;
  expect(bcookies.remove.mock.calls.length).toBe(1);
  expect(bcookies.remove).toBeCalledWith("session");
});

test("parsing a cookie", () => {
  const cookie = "session=eyJxxxxx";
  expect(parseCookie(cookie)).toEqual({ session: "eyJxxxxx" });
});

test("parsing many cookies", () => {
  const cookies = "session=eyJx..; redir=/courses/123; _googleT=12asd87";
  const expectedCookies = {
    session: "eyJx..",
    redir: "/courses/123",
    _googleT: "12asd87",
  };
  expect(parseCookie(cookies)).toEqual(expectedCookies);
});
