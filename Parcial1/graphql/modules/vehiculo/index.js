import gql from 'graphql-tag';

import getVehiculos from './queries/get-vehiculos.js';
import { getVehiculoById, getVehiculoByPlaca } from './queries/get-vehiculo-id.js';
import createVehiculo from './mutations/create-vehiculo.js';

export const typeDefs = gql`
  type Vehiculo {
    id: ID!
    placa: String
    marca: String
    fechaMatricula: String
    identificacionPropietario: String
    idPropietario: Int
  }

  input CreateVehiculoInput {
    placa: String!
    marca: String!
    fechaMatricula: String!
    identificacionPropietario: String!
  }

  type Query {
    getVehiculos: [Vehiculo]
    getVehiculoById(id: ID!): Vehiculo
    getVehiculoByPlaca(placa: String!): Vehiculo
  }

  type Mutation {
    crearVehiculo(input: CreateVehiculoInput!): Vehiculo
  }
`;

export const resolvers = {
    Query: {
        getVehiculos,
        getVehiculoById,
        getVehiculoByPlaca,
    },
    Mutation: {
        crearVehiculo: createVehiculo,
    },
};
