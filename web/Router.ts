/*
This file simply re-exports the router object from
"routes.js" so that it can be easily imported on client pages
that want access.
*/

import * as Routing from "./routes";

import { Router as IRouter, LinkProps } from "next-routes";

type LinkType = React.ComponentType<LinkProps>;

const Router: IRouter = Routing.Router;
const Link: LinkType = Routing.Link;

export { Router, Link };
