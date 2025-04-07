import gql from 'graphql-tag'; // usa graphql-tag si gql falla, ver abajo
import createInfraccion from './mutations/create-infraccion.js';
import getInfracciones from './queries/get-infracciones.js';

export const typeDefs = gql`
  type Infraccion {
    id: ID!
    fecha: String
    fuente: String
    placa: String
    vehiculoId: ID
  }

  input CreateInfraccionInput {
    fecha: String!
    fuente: String!
    placa: String!
    vehiculoId: ID
  }

  type Query {
    getInfracciones: [Infraccion]
  }

  type Mutation {
    crearInfraccion(input: CreateInfraccionInput!): Infraccion
  }
`;

export const resolvers = {
  Query: {
    getInfracciones,
  },
  Mutation: {
    crearInfraccion: createInfraccion,
  },
};
