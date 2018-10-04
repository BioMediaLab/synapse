export const MeDefaults = {
  defaults: {
    me: {
      __typename: "Me",
      id: null,
    },
  },
};

export const MeResolvers = {
  Mutation: {
    setMe: (_, { me }, { cache }) => {
      const data = { me, __typename: "Me" };
      cache.writeData(data);
    },
  },
};
