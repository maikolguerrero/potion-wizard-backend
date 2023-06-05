//Definimos el objeto de enrutamiento
const route = require('express').Router()

// Definimos la constante ingredientesController para poder realizar las acciones del CRUD
const ingredientesController = require('../controllers/ingredientes.controller');

//Ruta para listar todos los ingredientes
route.get('/', ingredientesController.listar);
// Ruta para buscar un ingrediente por ID
route.get('/:id', ingredientesController.buscarPorId);
// Ruta para buscar un ingredientes por nombre
route.get('/nombres/:nombres', ingredientesController.buscarPorNombre);

//Exportamos las rutas
module.exports = route;