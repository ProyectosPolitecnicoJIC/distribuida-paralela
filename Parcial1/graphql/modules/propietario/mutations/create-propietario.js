import Propietario from "../../../models/Propietario.js";
import DbService from '../../../dao/dbService.js';
import PropietarioRepository from '../../../repositories/propietarioRepository.js';

const dbService = new DbService();
const propietarioRepository = new PropietarioRepository(dbService);

export default async function createPropietario(_, { input }) {
    const propietario = new Propietario(
        input.identificacion,
        input.nombre,
        input.direccion,
        input.tipo
    );
    return await propietarioRepository.create(propietario);
}
