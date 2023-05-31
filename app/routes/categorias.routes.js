//Definimos el objeto de enrutamiento
const route = require('express').Router()

// Definimos la constante categoriasController para poder realizar las acciones del CRUD
const categoriasController = require('../controllers/categorias.controller');

//Ruta para listar todos las pociones
route.get('/', categoriasController.listar);

//Exportamos las rutas
module.exports = route;