import DbService from '../../../dao/dbService.js';
import PropietarioRepository from '../../../repositories/propietarioRepository.js';

const dbService = new DbService();
const propietarioRepository = new PropietarioRepository(dbService);

export default async function getPropietarios(_, __,) {
    return await propietarioRepository.getAll();
}