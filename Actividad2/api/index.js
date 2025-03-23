import express from 'express';
import infraccionRouter from './controllers/InfraccionController.js';

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





// INICIALIZACIÓN DEL SERVIDOR

app.listen(PORT, () => {
    console.log('Server listening on port 3000');
});
