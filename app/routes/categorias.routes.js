//Definimos el objeto de enrutamiento
const route = require('express').Router()

// Definimos la constante categoriasController para poder realizar las acciones del CRUD
const categoriasController = require('../controllers/categorias.controller');

// Ruta para listar todos las categorías
route.get('/', categoriasController.listar);
// Ruta para buscar una categoría por ID
route.get('/:id', categoriasController.buscarPorId);

//Exportamos las rutas
module.exports = route;