import { shield, and } from "graphql-shield";
import * as rules from "./rules";

export const permissions = shield({
  Query: {
    currentUser: rules.isAuthenticated,
    users: rules.isAuthenticated,
  },
});
