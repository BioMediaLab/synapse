import { rule } from "graphql-shield";
import { getUserId } from "../../utils/getUserId";

export const isAuthenticated = rule()(async (parent, args, ctx) => {
  const userId = getUserId(ctx);

  return Boolean(userId);
});
