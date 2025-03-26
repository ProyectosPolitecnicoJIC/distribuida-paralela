import { Router } from "express";
import DbService from "../dao/dbService.js";
import ReporteRepository from "../repositories/reporteRepository.js";

const reportesRouter = Router();

const dbService = new DbService();
const reporteRepository = new ReporteRepository(dbService);

reportesRouter.get('/infracciones/:identificacion', async (req, res) => {
    const infracciones = await reporteRepository.getInfraccionesByPropietarioIdentificacion(req.params.identificacion);
    res.json(infracciones);
});

export default reportesRouter;


