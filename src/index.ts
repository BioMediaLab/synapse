import { GraphQLServer } from "graphql-yoga";
import { resolvers, typeDefs } from "./resources/main";

const server = new GraphQLServer({
    resolvers,
    typeDefs,
});

server.start({
    port: 4000,
}).then(() => {
    console.log("server ready");
});
