// Definimos la constante pocionesModel para poder obtener los datos de la BD
const pocionesModel = require('../models/pociones.model');
const categoriasModel = require('../models/categorias.model');
const ingredientesModel = require('../models/ingredientes.model');
const { borrarImagen } = require('../multer/multer');
const path = require('path');

class PocionesController {
  // Mostrar lista de las pociones
  async listar(req, res) {
    try {
      const pociones = await pocionesModel.listar();
      res.status(200).json({ status: 200, message: 'Se obtuvieron las pociones exitosamente.', data: pociones });
    } catch (error) {
      res.status(500).json({ status: 500, message: `Error al obtener las pociones: ${error.message}` });
    }
  }

  // Mostrar categoría por id
  async buscarPorId(req, res) {
    const { id } = req.params;
    try {
      const pocion = await pocionesModel.buscarPorId(id);
      if (!pocion) {
        return res.status(404).json({ status: 404, message: 'Poción no encontrada.' });
      }
      res.status(200).json({ status: 200, message: 'Poción encontrada.', data: pocion });
    } catch (error) {
      res.status(500).json({ status: 500, message: `Error al buscar la poción: ${error}` });
    }
  }

  // Mostrar categorías con búsqueda por nombre, descripción y categoría
  async buscar(req, res) {
    const { terminos } = req.params;
    try {
      const pociones = await pocionesModel.buscarPorTerminos(terminos);
      if (!pociones) {
        return res.status(404).json({ status: 404, message: 'Ninguna poción encontrada.' });
      }
      res.status(200).json({ status: 200, message: 'Pociones encontradas.', data: pociones });
    } catch (error) {
      res.status(500).json({ status: 500, message: `Error al buscar las pociones: ${error}` });
    }
  }

  // Verificar que el nombre de la función existe
  static async validarNombrePocionExistente(nombre) {
    const pocionExistente = await pocionesModel.buscarPorNombre(nombre);
    return pocionExistente;
  }

  // Verificar si una categoría existe por su ID
  static async validarCategoriaExistente(categoriaID) {
    const categoria = await categoriasModel.buscarPorId(categoriaID);
    return categoria;
  }

  // Verificar si los ingredientes existen por sus IDs
  static async validarIngredientesExistentes(ingredientesIDs) {
    const ingredientesExistentes = [];
    for (const ingredienteId of ingredientesIDs) {
      const ingrediente = await ingredientesModel.buscarPorId(ingredienteId);
      if (ingrediente) {
        ingredientesExistentes.push(ingrediente);
      }
    }
    return ingredientesExistentes;
  }

  // Crear una nueva poción
  async crear(req, res) {
    const { nombre, descripcion, precio, cantidad, categoriaID, ingredientesIDs } = req.body;
    // Obtenemos la ruta de la imagen
    const rutaImagen = req.file.path;
    // Obtenemos el nombre de la imagen
    const imagen = path.basename(rutaImagen);

    try {
      // Verificar si ya existe una poción con el mismo nombre
      const nombreExistente = await PocionesController.validarNombrePocionExistente(nombre);
      if (nombreExistente) {
        borrarImagen(rutaImagen);
        return res.status(400).json({ status: 400, message: 'Ya existe una poción con ese nombre.' });
      }

      // Verificar si la categoría existe
      const categoriaExistente = await PocionesController.validarCategoriaExistente(categoriaID);
      if (!categoriaExistente) {
        borrarImagen(rutaImagen);
        return res.status(400).json({ status: 400, message: 'La categoría especificada no existe.' });
      }

      // Verificar si los ingredientes existen
      const ingredientesExistentes = await PocionesController.validarIngredientesExistentes(ingredientesIDs);
      if (ingredientesExistentes.length !== ingredientesIDs.length) {
        borrarImagen(rutaImagen);
        return res.status(400).json({ status: 400, message: 'Alguno(s) de los ingredientes especificados no existe(n).' });
      }

      // Crear la nueva poción
      const nuevaPocionId = await pocionesModel.crear({ nombre, descripcion, precio, cantidad, imagen });

      // Relacionar la poción con las categorías
      await pocionesModel.relacionarPocionConCategorias(nuevaPocionId, categoriaID);

      // Relacionar la poción con los ingredientes
      await pocionesModel.relacionarPocionConIngredientes(nuevaPocionId, ingredientesIDs);

      return res.status(201).json({ status: 201, message: 'Poción creada exitosamente.', data: { id: nuevaPocionId } });
    } catch (error) {
      borrarImagen(rutaImagen);
      return res.status(500).json({ status: 500, message: `Error al crear la poción: ${error}` });
    }
  }
}

// Exportación de las funciones
const pocionesC = new PocionesController();
module.exports = pocionesC;