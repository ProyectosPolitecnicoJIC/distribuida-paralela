import DbService from '../../../dao/dbService.js';
import PropietarioRepository from '../../../repositories/propietarioRepository.js';

const dbService = new DbService();
const propietarioRepository = new PropietarioRepository(dbService);

export default async function deletePropietario(_, { id }) {
    await propietarioRepository.delete(id);
    return `propietario con id ${id} se eliminó`;
}

