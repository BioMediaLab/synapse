import { Prisma } from "./generated/prisma-client";
import { Request } from "express";

export interface Context {
  prisma: Prisma;
  req: Request;
  user_id: string;
}
