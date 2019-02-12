import { Prisma } from "./generated/prisma-client";

export interface Context {
  prisma: Prisma;
  user_id: string;
}
