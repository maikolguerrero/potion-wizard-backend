const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

// Establecer el puerto
app.set('port', port);

// Rutas de la app
app.use('/ingredientes', require('./routes/ingredientes.routes'));
app.use('/pociones', require('./routes/pociones.routes'));

// Middleware para manejar rutas no encontradas y devolver error 404
app.use((req, res, next) => {
    res.status(404).json({ status: 404, message: "La ruta que buscas no existe" });
});

// Exportamos la constante app 
module.exports = app;