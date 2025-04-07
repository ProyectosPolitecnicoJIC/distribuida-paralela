import { z } from 'zod';

const VehiculoSchema = z.object({
    id: z.number().int().positive().optional(),
    placa: z.string().min(1).max(10),
    marca: z.string().min(1).max(50),
    fecha_matricula: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Formato YYYY-MM-DD
    identificacion_propietario: z.string().min(1).max(20),
});

export default VehiculoSchema;
