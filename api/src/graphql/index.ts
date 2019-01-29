import { shield } from "graphql-shield";
import { IResolvers } from "graphql-tools";

import {
  createTopLevelResolver,
  shieldBuilder,
  resolverBuilder,
} from "./makeResolvers";
import { IntResolverContext } from "../graphqlContext";
import { prisma, Notification } from "../../generated/prisma";

import { Query } from "./resolvers/Query";
import { Mutation } from "./resolvers/Mutation";
import { ContentPiece } from "./resolvers/ContentPiece";
import { CourseUser } from "./resolvers/CourseUser";
import { User } from "./resolvers/User";
import { Notification as NotitificationResolvers } from "./resolvers/Notification";
import { Course } from "./resolvers/Course";
import { MessageTarget } from "./resolvers/MessageTarget";
import { Message } from "./resolvers/Message";

const Subscription = {
  notification: {
    subscribe: async (
      root,
      args,
      context: IntResolverContext,
      info,
    ): Promise<AsyncIterator<Notification>> => {
      const { db, id } = context;
      return db.$subscribe
        .notification({
          AND: [
            { mutation_in: "CREATED" },
            {
              node: {
                target: {
                  reads_some: {
                    user: { id },
                  },
                },
              },
            },
          ],
        })
        .node();
    },
    resolve: async (data: Notification, args, context) => {
      const readRecords = await prisma
        .notification({ id: data.id })
        .target()
        .reads({
          where: {
            user: {
              id: context.id,
            },
          },
        });

      if (readRecords.length !== 1) {
        throw new Error("could not find correct records");
      }
      return {
        notification: data,
        read: false,
        readRecordId: readRecords[0].id,
      };
    },
  },
};

createTopLevelResolver("Query", Query);
createTopLevelResolver("Mutation", Mutation);
createTopLevelResolver("ContentPiece", ContentPiece);
createTopLevelResolver("CourseUser", CourseUser);
createTopLevelResolver("User", User);
createTopLevelResolver("Notification", NotitificationResolvers);
createTopLevelResolver("Course", Course);
createTopLevelResolver("MessageTarget", MessageTarget);
createTopLevelResolver("Message", Message);

export const getShield = () => shield(shieldBuilder);
export const getResolvers = (): IResolvers => {
  if (!resolverBuilder.Subscription) {
    resolverBuilder.Subscription = Subscription as any;
  }
  return resolverBuilder as any;
};
