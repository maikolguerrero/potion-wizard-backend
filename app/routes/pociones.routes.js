//Definimos el objeto de enrutamiento
const route = require('express').Router()

// Definimos la constante pocionesController para poder realizar las acciones del CRUD
const pocionesController = require('../controllers/pociones.controller');

//Ruta para listar todos las pociones
route.get('/', pocionesController.listar);

//Exportamos las rutas
module.exports = route;