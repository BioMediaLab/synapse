import { Request } from "express";
import { PubSub } from "graphql-yoga";
import { ContextCallback } from "graphql-yoga/dist/types";

import { Prisma, prisma } from "../generated/prisma";
import bindingDb from "./db";

export interface IntResolverContext {
  id?: string;
  req?: Request;
  jwt?: string;
  isPublic?: boolean;
  pubsub: PubSub;
  bindingDb: any; // this is the Prisma object from prisma-bindings
  db: Prisma;
}

const pubsub = new PubSub();

export const contextCreatorFactory = (): ContextCallback => {
  const contextCreator: ContextCallback = (initialCtx): IntResolverContext => {
    const req = initialCtx.request;
    let jwt: string | null = null;
    if (req && req.get) {
      jwt = req.get("authorization");
    }
    if (
      initialCtx.connection &&
      initialCtx.connection.context &&
      initialCtx.connection.context.jwt
    ) {
      jwt = initialCtx.connection.context.jwt;
    }

    return {
      db: prisma,
      req,
      jwt,
      pubsub,
      bindingDb,
      isPublic: false,
    };
  };
  return contextCreator;
};
