import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './modules/infraccion/index.js';
import { makeExecutableSchema } from '@graphql-tools/schema';

const app = express();

// Crear el schema combinando typeDefs y resolvers
const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startServer() {
    const server = new ApolloServer({ schema });
    await server.start();
    server.applyMiddleware({ app });
}

startServer();

app.listen({ port: 4200 }, () =>
    console.log(`🚀 Server ready at http://localhost:4200${ApolloServer.graphqlPath}`)
);
