import VehiculoRepository from "../repositories/vehiculoRepository.js";
import PropietarioRepository from "../repositories/propietarioRepository.js";
import DbService from "../dao/dbService.js";
import { Router } from "express";
import validate from "../middlewares/validateSchema.js";
import vehiculoSchema from "../middlewares/validacionCampos/vehiculoSchema.js";

const vehiculoRouter = Router();

import Vehiculo from '../models/vehiculo.js';

const dbService = new DbService();
const vehiculoRepository = new VehiculoRepository(dbService);
const propietarioRepository = new PropietarioRepository(dbService);


vehiculoRouter.post('/', validate(vehiculoSchema), async (req, res) => {
    const vehiculo = new Vehiculo(req.body.placa, req.body.marca, req.body.fecha_matricula, req.body.identificacion_propietario, 0,0);
    const propietarioExiste = await propietarioRepository.getByIdentificacion(vehiculo.identificacionPropietario);
    if(!propietarioExiste){
        res.status(400).send('El propietario no existe');
        return;
    }
    vehiculo.idPropietario = propietarioExiste.id;
    const result = await vehiculoRepository.create(vehiculo);
    res.json(result);
});

vehiculoRouter.get('/', async (req, res) => {
    const vehiculos = await vehiculoRepository.getAll();
    res.json(vehiculos);
});

vehiculoRouter.get('/:id', async (req, res) => {
    const vehiculo = await vehiculoRepository.getById(req.params.id);
    res.json(vehiculo);
});

vehiculoRouter.get('/placa/:placa', async (req, res) => {
    const vehiculo = await vehiculoRepository.getByPlaca(req.params.placa);
    res.json(vehiculo);
});

export default vehiculoRouter;