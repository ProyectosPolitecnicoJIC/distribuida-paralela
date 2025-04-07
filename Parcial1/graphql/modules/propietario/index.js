import gql from 'graphql-tag';
import getPropietarios from './queries/get-propietarios.js';
import { getPropietarioById, getPropietarioByIdentificacion } from './queries/get-propietario-id.js';
import createPropietario from './mutations/create-propietario.js';
import updatePropietario from './mutations/update-propietario.js';
import deletePropietario from './mutations/delete-propietario.js';

export const typeDefs = gql`
  type Propietario {
    id: ID!
    identificacion: String
    nombre: String
    direccion: String
    tipo: String
  }

  input CreatePropietarioInput {
    identificacion: String!
    nombre: String!
    direccion: String!
    tipo: String!
  }

  input UpdatePropietarioInput {
    identificacion: String!
    nombre: String!
    direccion: String!
    tipo: String!
  }

  type Query {
    getPropietarios: [Propietario]
    getPropietarioById(id: ID!): Propietario
    getPropietarioByIdentificacion(identificacion: String!): Propietario
  }

  type Mutation {
    crearPropietario(input: CreatePropietarioInput!): Propietario
    actualizarPropietario(id: ID!, input: UpdatePropietarioInput!): Propietario
    eliminarPropietario(id: ID!): String
  }
`;

export const resolvers = {
  Query: {
    getPropietarios,
    getPropietarioById,
    getPropietarioByIdentificacion,
  },
  Mutation: {
    crearPropietario: createPropietario,
    actualizarPropietario: updatePropietario,
    eliminarPropietario: deletePropietario,
  },
};
