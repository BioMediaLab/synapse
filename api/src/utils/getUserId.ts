import { verify } from "jsonwebtoken";
import { Context } from "../context";

export const JWT_SECRET = process.env.JWT_GENERATION_SECRET;

type Token = {
  userId: string;
};

export function getUserId(ctx: Context) {
  const Authorization = ctx.req.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const verifiedToken = verify(token, JWT_SECRET) as Token;
    return verifiedToken && verifiedToken.userId;
  }
}
