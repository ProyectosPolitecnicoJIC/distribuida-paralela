import { Router } from "express";
import validate from "../middlewares/validateSchema.js";
import createInfraccionSchema from "../middlewares/validacionCampos/infraccionSchema.js";

const infraccionRouter = Router();

import Infraccion from '../models/Infraccion.js';
import InfraccionRepository from '../repositories/infraccionRepository.js';
import DbService from '../dao/dbService.js';

const dbService = new DbService();
const infraccionRepository = new InfraccionRepository(dbService);


infraccionRouter.post('/',validate(createInfraccionSchema), async (req, res) => {

    res.send('Infraccion created').status(201);
});

export default infraccionRouter;





