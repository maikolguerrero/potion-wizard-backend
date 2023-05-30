//Definimos el objeto de enrutamiento
const route = require('express').Router()

// Definimos la constante ingredientesController para poder realizar las acciones del CRUD
const ingredientesController = require('../controllers/ingredientes.controller');

//Ruta para listar todos los ingredientes
route.get('/', ingredientesController.listar);

//Exportamos las rutas
module.exports = route;