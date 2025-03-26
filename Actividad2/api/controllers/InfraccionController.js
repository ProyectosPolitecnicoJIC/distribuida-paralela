import { Router } from "express";
import validate from "../middlewares/validateSchema.js";
import createInfraccionSchema from "../middlewares/validacionCampos/infraccionSchema.js";

const infraccionRouter = Router();

import Infraccion from '../models/Infraccion.js';
import InfraccionRepository from '../repositories/infraccionRepository.js';
import VehiculoRepository from '../repositories/vehiculoRepository.js';
import DbService from '../dao/dbService.js';

const dbService = new DbService();
const infraccionRepository = new InfraccionRepository(dbService);
const vehiculoRepository = new VehiculoRepository(dbService);


infraccionRouter.post('/',validate(createInfraccionSchema), async (req, res) => {

    const infraccion = new Infraccion(req.body.fecha, req.body.fuente, req.body.placa);
    const placaVehiculoExiste = await vehiculoRepository.getByPlaca(req.body.placa);
    if(!placaVehiculoExiste){
        res.status(400).send('El vehiculo no existe');
        return;
    }
    console.log(placaVehiculoExiste);
    infraccion.vehiculoId = placaVehiculoExiste.id;
    const result = await infraccionRepository.create(infraccion);
    res.json(result).status(201);
});

infraccionRouter.get('/', async (req, res) => {
    const infracciones = await infraccionRepository.getAll();
    res.json(infracciones);
});


export default infraccionRouter;





