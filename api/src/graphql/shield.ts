import { shield, not } from "graphql-shield";
import * as rules from "./rules";

export const permissionLayer = shield({
  Query: {
    course: rules.userHasCourseWhere,
  },
  Mutation: {
    createCourse: rules.isSystemAdmin,
    promoteUser: rules.isSystemAdmin,
    deleteUser: rules.isSystemAdmin,
  },
});
