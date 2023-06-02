//Definimos el objeto de enrutamiento
const route = require('express').Router()

// Definimos la constante pocionesController para poder realizar las acciones del CRUD
const pocionesController = require('../controllers/pociones.controller');

// Importamos la configuración del middleware de multer para subir archivos
const { upload } = require('../../config/multer');

// Ruta para listar todos las pociones
route.get('/', pocionesController.listar);
// Ruta para buscar una poción por ID
route.get('/:id', pocionesController.buscarPorId);
// Ruta para buscar pociones
route.get('/buscar/:terminos', pocionesController.buscar);
// Ruta para crear una poción
route.post('/crear', upload.single('imagen'), pocionesController.crear);
// Ruta para editar una poción
route.put('/editar', upload.single('imagen'), pocionesController.editar);
// Ruta para eliminar una poción
route.delete('/eliminar/:id', pocionesController.eliminar);

//Exportamos las rutas
module.exports = route;