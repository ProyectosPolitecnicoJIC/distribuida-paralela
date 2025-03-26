import express from 'express';
import infraccionRouter from './controllers/InfraccionController.js';
import propietarioRouter from './controllers/propietarioController.js';
import vehiculoRouter from './controllers/vehiculoController.js';
import reportesRouter from './controllers/reportesController.js';
// CONSTANTES
const PORT = 4000;
const app = express();

// MIDDLEWARES
app.use(express.json());



// RUTAS
app.get('/health', (req, res) => {
    res.send({ status: 'ok' }).status(200);
});
app.use('/infracciones', infraccionRouter);
app.use('/propietarios', propietarioRouter);
app.use('/vehiculos', vehiculoRouter);
app.use('/reportes', reportesRouter);




// INICIALIZACIÓN DEL SERVIDOR

app.listen(PORT, () => {
    console.log('Server listening on port 3000');
});
