const express = require('express');
const app = express();
app.use(express.json());

// Importar controladores
const citaController = require('./Backend/controllers/citaController');
const authController = require('./Backend/controllers/authController');

// Rutas
app.post('/api/login', authController.login);
app.post('/api/citas/reservar', citaController.reservarCita);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));