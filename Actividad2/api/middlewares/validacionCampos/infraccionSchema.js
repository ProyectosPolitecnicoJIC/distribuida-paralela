import { z } from 'zod';

const createInfraccionSchema = z.object({
    id: z.number().int().positive().optional(),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Formato YYYY-MM-DD
    fuente: z.enum(["AGENTE", "CAMARA"]),
    tipo_vehiculo: z.enum(["MOTO", "CARRO", "PESADO"]),
    placa: z.string().regex(/^[A-Z]{3}\d{3}$|^[A-Z]{3}\d{2}[A-Z]{1}$/),
});



export default createInfraccionSchema;
