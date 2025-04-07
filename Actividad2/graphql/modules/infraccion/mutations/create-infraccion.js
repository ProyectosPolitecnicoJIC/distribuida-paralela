import Infraccion from '../../../models/Infraccion.js';
import InfraccionRepository from '../../../repositories/infraccionRepository.js';
import VehiculoRepository from '../../../repositories/vehiculoRepository.js';
import DbService from '../../../dao/dbService.js';

const dbService = new DbService();
const infraccionRepository = new InfraccionRepository(dbService);
const vehiculoRepository = new VehiculoRepository(dbService);

export default async (root, { input }) => {

    const { fecha, fuente, placa } = input;

    const placaVehiculoExiste = await vehiculoRepository.getByPlaca(placa);

    if (!placaVehiculoExiste) {
        console.error('🚫 Vehículo no encontrado para la placa:', placa);
        throw new Error('El vehiculo no existe');
    }

    const infraccion = new Infraccion(fecha, fuente, placa, null, placaVehiculoExiste.id);

    const result = await infraccionRepository.create(infraccion);

    return result;
};
