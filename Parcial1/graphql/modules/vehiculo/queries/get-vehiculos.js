import VehiculoRepository from '../../../repositories/vehiculoRepository.js';

import DbService from '../../../dao/dbService.js';

const dbService = new DbService();
const vehiculoRepository = new VehiculoRepository(dbService);

export default async function getVehiculos() {
    return await vehiculoRepository.getAll();
}
