import DbService from "../dao/dbService.js";
import PropietarioRepository from "../repositories/propietarioRepository.js";
import { Router } from "express";
import Propietario from "../models/Propietario.js";
import validate from "../middlewares/validateSchema.js";
import propietarioSchema from "../middlewares/validacionCampos/propietarioSchema.js";

const dbService = new DbService();
const propietarioRepository = new PropietarioRepository(dbService);

const propietarioRouter = Router();

propietarioRouter.post('/', validate(propietarioSchema), async (req, res) => {
    const propietario = new Propietario(req.body.identificacion, req.body.nombre, req.body.direccion, req.body.tipo);
    const result = await propietarioRepository.create(propietario);
    res.json(result);
});

propietarioRouter.get('/', async (req, res) => {
    const propietarios = await propietarioRepository.getAll();
    res.json(propietarios);
});

propietarioRouter.get('/:id', async (req, res) => {
    const propietario = await propietarioRepository.getById(req.params.id);
    res.json(propietario);
});

propietarioRouter.get('/identificacion/:identificacion', async (req, res) => {
    const propietario = await propietarioRepository.getByIdentificacion(req.params.identificacion);
    res.json(propietario);
});

propietarioRouter.put('/:id', async (req, res) => {
    const propietario = new Propietario(req.body.identificacion, req.body.nombre, req.body.direccion, req.body.tipo, req.params.id);
    const result = await propietarioRepository.update(propietario);
    res.json(result);
});

propietarioRouter.delete('/:id', async (req, res) => {
    const result = await propietarioRepository.delete(req.params.id);
    res.json(result);
});

export default propietarioRouter;