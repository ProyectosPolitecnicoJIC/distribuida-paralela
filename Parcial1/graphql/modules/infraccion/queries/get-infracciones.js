import InfraccionRepository from '../../../repositories/infraccionRepository.js';
import DbService from '../../../dao/dbService.js';

const dbService = new DbService();
const infraccionRepository = new InfraccionRepository(dbService);

export default async () => {
    const infracciones = await infraccionRepository.getAll();
    return infracciones;
};



