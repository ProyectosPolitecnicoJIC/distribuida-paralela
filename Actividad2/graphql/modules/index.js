import gql from 'apollo-server-express';
const infraccion = require('./infraccion');
//const propietario = require('./propietario');
//const reportes = require('./reportes');
//const vehiculo = require('./vehiculo');

const { GraphQLScalarType } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const typeDefs = gql`
  scalar Time
  type Query {
    getVersion: String!
  }
  type Mutation {
    version: String!
  }
`;
const timeScalar = new GraphQLScalarType({
    name: 'Time',
    description: 'Time custom scalar type',
    serialize: (value) => value,
});
const resolvers = {
    Time: timeScalar,
    Query: {
        getVersion: () => `v1`,
    },
};
const schema = makeExecutableSchema({
    typeDefs: [typeDefs, infraccion.typeDefs /*, propietario.typeDefs, reportes.typeDefs, vehiculo.typeDefs */],
    resolvers: [resolvers, infraccion.resolvers],
});
module.exports = schema;