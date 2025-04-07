import DbService from '../../../dao/dbService.js';
import ReporteRepository from '../../../repositories/reporteRepository.js';

const dbService = new DbService();
const reporteRepository = new ReporteRepository(dbService);

export default async function getInfraccionesByPropietarioIdentificacion(_, { identificacion }) {
    return await reporteRepository.getInfraccionesByPropietarioIdentificacion(identificacion);
}