import DbService from '../../../dao/dbService.js';
import PropietarioRepository from '../../../repositories/propietarioRepository.js';

const dbService = new DbService();
const propietarioRepository = new PropietarioRepository(dbService);

export const getPropietarioById = async (_, { id }) => {
    return await propietarioRepository.getById(id);
};

export const getPropietarioByIdentificacion = async (_, { identificacion }) => {
    return await propietarioRepository.getByIdentificacion(identificacion);
};
