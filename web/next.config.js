const withTypescript = require("@zeit/next-typescript");
const withCSS = require("@zeit/next-css");

module.exports = withCSS(
  withTypescript({
    useFileSystemPublicRoutes: false,
    publicRuntimeConfig: {
      // Will be available on both server and client
      staticFolder: "/static",
      API_URL: process.env.API_URL,
      API_URL_GOOGLE: process.env.API_URL_GOOGLE,
      WEBSOCKET_URL: process.env.WEBSOCKET_URL,
    },
  }),
);
