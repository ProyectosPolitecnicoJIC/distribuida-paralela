import { z } from 'zod';

const PropietarioSchema = z.object({
    id: z.number().int().positive().optional(),
    nombre: z.string().min(1).max(100),
    identificacion: z.string().min(1).max(20),
    direccion: z.string().min(1).max(100),
    tipo: z.enum(["PERSONA", "EMPRESA"]),
});

export default PropietarioSchema;