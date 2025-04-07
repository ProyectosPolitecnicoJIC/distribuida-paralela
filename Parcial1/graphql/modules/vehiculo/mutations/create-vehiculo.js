import VehiculoRepository from '../../../repositories/vehiculoRepository.js';
import PropietarioRepository from '../../../repositories/propietarioRepository.js';
import Vehiculo from '../../../models/Vehiculo.js';
import DbService from '../../../dao/dbService.js';

const dbService = new DbService();
const propietarioRepository = new PropietarioRepository(dbService);
const vehiculoRepository = new VehiculoRepository(dbService);

export default async function createVehiculo(_, { input }) {
    const propietario = await propietarioRepository.getByIdentificacion(input.identificacionPropietario);

    if (!propietario) {
        throw new Error('El propietario no existe');
    }

    const vehiculo = new Vehiculo(
        input.placa,
        input.marca,
        input.fechaMatricula,
        input.identificacionPropietario,
        propietario.id
    );

    return await vehiculoRepository.create(vehiculo);
}
