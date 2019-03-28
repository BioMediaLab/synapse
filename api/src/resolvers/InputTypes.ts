import { inputObjectType } from "nexus";

export const CourseUserAndRole = inputObjectType({
  name: "CourseUserAndRole",
  definition(t) {
    t.id("user_id");
    t.field("role", {
      type: "CourseRoleType",
    });
  },
});
