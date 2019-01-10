import { IntResolverContext } from "../graphqlContext";
import { Rule, RuleOr, RuleAnd } from "graphql-shield/dist/rules";

interface IResolverDouble {
  resolver: (
    root: any,
    args: any,
    context: IntResolverContext,
    info: any,
  ) => Promise<any>;
  shield?: Rule | RuleOr | RuleAnd;
}

interface IResolverMap {
  [key: string]: IResolverDouble;
}

export const shieldBuilder = {};

export const resolverBuilder = {
  Subscription: false,
};

export const createTopLevelResolver = (
  resolverType: string,
  resolverMap: IResolverMap,
) => {
  const newResolverMap = Object.create({});
  const newShieldMap = Object.create({});
  Object.keys(resolverMap).forEach(key => {
    const { resolver } = resolverMap[key];
    if (key in newResolverMap || key in newShieldMap) {
      throw new Error(`Key ${key} is already defined`);
    }
    newResolverMap[key] = resolver;

    // the shield is optional
    if (resolverMap[key].shield) {
      newShieldMap[key] = resolverMap[key].shield;
    }
  });
  if (resolverType in shieldBuilder || resolverType in resolverBuilder) {
    throw new Error("failed to create resolver map.");
  }
  resolverBuilder[resolverType] = newResolverMap;

  if (Object.keys(shieldBuilder).length > 0) {
    shieldBuilder[resolverType] = newShieldMap;
  }
};
