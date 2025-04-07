import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLScalarType } from 'graphql';
import gql from 'apollo-server-express'; // o 'apollo-server-express' si prefieres

import * as infraccion from './infraccion/index.js';
import * as propietario from './propietario/index.js';
import * as reportes from './reportes/index.js';
import * as vehiculo from './vehiculo/index.js';


const timeScalar = new GraphQLScalarType({
  name: 'Time',
  description: 'Time custom scalar type',
  serialize: (value) => value,
});

const baseResolvers = {
  Time: timeScalar,
  Query: {
    getVersion: () => 'v1',
  },
  Mutation: {
    version: () => 'v1',
  },
};

export const typeDefs = [
  infraccion.typeDefs,
  propietario.typeDefs,
  reportes.typeDefs,
  vehiculo.typeDefs,
];

export const resolvers = [
  infraccion.resolvers,
  propietario.resolvers,
  reportes.resolvers,
  vehiculo.resolvers,
];
