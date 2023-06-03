const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();
const path = require('path');
const port = process.env.PORT || 3000;

// Establecer el puerto
app.set('port', port);

// Rutas de la app
app.use('/ingredientes', require('./routes/ingredientes.routes'));
app.use('/pociones', require('./routes/pociones.routes'));
app.use('/categorias', require('./routes/categorias.routes'));

// Definir la ruta para mostrar las imágenes
app.use('/images', express.static(path.join(__dirname, '../static/images')));

// Middleware para manejar rutas no encontradas y devolver error 404
app.use((req, res, next) => {
    res.status(404).json({ status: 404, message: "La ruta que buscas no existe" });
});

// Exportamos la constante app 
module.exports = app;