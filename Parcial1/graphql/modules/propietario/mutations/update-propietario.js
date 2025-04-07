import Propietario from "../../../models/Propietario.js";
import DbService from '../../../dao/dbService.js';
import PropietarioRepository from '../../../repositories/propietarioRepository.js';

const dbService = new DbService();
const propietarioRepository = new PropietarioRepository(dbService);


export default async function updatePropietario(_, { id, input }) {
  const propietario = new Propietario(
    input.identificacion,
    input.nombre,
    input.direccion,
    input.tipo,
    id
  );
  return await propietarioRepository.update(propietario);
}

