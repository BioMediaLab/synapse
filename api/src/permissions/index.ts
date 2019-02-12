import { shield, and } from "graphql-shield";
import * as rules from "./rules";

export const permissions = shield({
  Query: {
    users: rules.isAuthenticated,
  },
});
