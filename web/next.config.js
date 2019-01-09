const withTypescript = require("@zeit/next-typescript");
const withCSS = require("@zeit/next-css");
const dotenv = require("dotenv");

module.exports = withCSS(
  withTypescript({
    useFileSystemPublicRoutes: false,
    publicRuntimeConfig: {
      // Will be available on both server and client
      staticFolder: "/static",
      API_URL: process.env.API_URL,
      API_URL_GOOGLE: process.env.API_URL_GOOGLE,
      WEBSOCKET_URL: process.env.WEBSOCKET_URL,
      FILESTACK_API_KEY: process.env.FILESTACK_API_KEY,
    },
    onDemandEntries: {
      // period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: 25 * 1000,
      // number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 5,
    },
  }),
);
