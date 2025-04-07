import VehiculoRepository from '../../../repositories/vehiculoRepository.js';
import DbService from '../../../dao/dbService.js';

const dbService = new DbService();
const vehiculoRepository = new VehiculoRepository(dbService);

export async function getVehiculoById(_, { id }) {
    return await vehiculoRepository.getById(id);
}

export async function getVehiculoByPlaca(_, { placa }) {
    return await vehiculoRepository.getByPlaca(placa);
}