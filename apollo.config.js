module.exports = {
  client: {
    service: {
      name: "synapse",
      localSchemaFile: "./api/src/generated/schema.graphql",
    },
  },
  service: {
    localSchemaFile: "./api/src/generated/schema.graphql",
  },
};
