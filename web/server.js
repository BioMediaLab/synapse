require("./config").config();

const Sentry = require("@sentry/node");
Sentry.init({
  dsn: "https://b9f7feb6bbc045bb9dce100a1208ad84@sentry.io/1366990",
});

const express = require("express");
const next = require("next");
const routes = require("./routes");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = routes.getRequestHandler(app);

app.prepare().then(() => {
  const server = express().use(handle);

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
