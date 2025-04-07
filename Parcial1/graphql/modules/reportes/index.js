import gql from 'graphql-tag';
import getInfraccionesByPropietarioIdentificacion from './queries/get-reportes.js';

export const typeDefs = gql`
  type Query {
    getInfraccionesByPropietarioIdentificacion(identificacion: String!): [Infraccion]
  }
`;

export const resolvers = {
    Query: {
        getInfraccionesByPropietarioIdentificacion
    }
};
