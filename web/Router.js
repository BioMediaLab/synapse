/*
This file simply re-exports the router object from
"routes.js" so that it can be easily imported on client pages
that want access.
*/

import * as Routing from "./routes";

const Router = Routing.Router;
const Link = Routing.Link;

export { Router, Link };
