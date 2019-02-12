import { validateJWT } from "../utils/jwt";

export const authMiddleware = async (resolve, parent, args, ctx, info) => {
  if (ctx.isPublic) {
    return resolve();
  }

  const jwt = ctx.jwt;

  const me = await validateJWT(jwt);

  if (!me.isValid) {
    throw new Error("unauthorized");
  }

  ctx.id = me.uid;

  return resolve();
};
