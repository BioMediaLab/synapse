import { rule } from "graphql-shield";
import { validateJWT } from "../../utils/jwt";

export const isAuthenticated = rule()(async (parent, args, ctx) => {
  const jwt = ctx.jwt;

  if (!jwt) {
    return new Error("unauthorized");
  }

  const me = await validateJWT(jwt);

  if (!me.isValid) {
    throw new Error("unauthorized");
  }

  ctx.user_id = me.uid;
});
