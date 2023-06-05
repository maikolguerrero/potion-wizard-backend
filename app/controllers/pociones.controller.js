// Definimos la constante pocionesModel para poder obtener los datos de la BD
const pocionesModel = require('../models/pociones.model');
const categoriasModel = require('../models/categorias.model');
const ingredientesModel = require('../models/ingredientes.model');
const { borrarImagen } = require('../../config/multer');
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
  static async validarPocionExistente(id) {
    const pocionExistente = await pocionesModel.buscarPorId(id);
    return pocionExistente;
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
  static async validarIngredientesExistentes(ingredientesIDs, cantidad) {
    const ingredientesExistentes = [];
    for (const ingredienteId of ingredientesIDs) {
      const ingrediente = await ingredientesModel.buscarPorId(ingredienteId);
      if (ingrediente) {
        // Verificar la disponibilidad del ingrediente
        if (ingrediente.cantidad >= cantidad) {
          ingredientesExistentes.push(ingrediente);
        }
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

    // Convertir los ingredientesIDs en un array
    const nuevosIngredientesIds = ingredientesIDs.split(',');

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

      // Verificar si los ingredientes existen y su disponibilidad
      const ingredientesExistentes = await PocionesController.validarIngredientesExistentes(nuevosIngredientesIds, cantidad);
      if (ingredientesExistentes.length !== nuevosIngredientesIds.length) {
        borrarImagen(rutaImagen);
        return res.status(400).json({ status: 400, message: 'Alguno(s) de los ingredientes especificados no existe(n) o no están disponibles.' });
      }

      // Restar la cantidad de pociones que se quieren crear a la cantidad de cada ingrediente utilizado
      for (const ingrediente of ingredientesExistentes) {
        await ingredientesModel.actualizarCantidad(ingrediente.id, ingrediente.cantidad - cantidad);
      }

      // Crear la nueva poción
      const nuevaPocionId = await pocionesModel.crear({ nombre, descripcion, precio, cantidad, imagen });

      // Relacionar la poción con las categorías
      await pocionesModel.relacionarPocionConCategorias(nuevaPocionId, categoriaID);

      // Relacionar la poción con los ingredientes
      await pocionesModel.relacionarPocionConIngredientes(nuevaPocionId, nuevosIngredientesIds);

      return res.status(201).json({ status: 201, message: 'Poción creada exitosamente.', data: { id: nuevaPocionId } });
    } catch (error) {
      borrarImagen(rutaImagen);
      return res.status(500).json({ status: 500, message: `Error al crear la poción: ${error}` });
    }
  }

  // Función para actualizar la relación de una poción con categorías
  static async actualizarRelacionConCategoria(pocionId, nuevaCategoriaId) {
    try {
      await pocionesModel.actualizarRelacionConCategoria(pocionId, nuevaCategoriaId);
    } catch (error) {
      console.log(`Hubo un error al actualizar la relación de la poción ${pocionId} con la categoría:`, error);
      throw error;
    }
  }

  // Función para actualizar la relación de una poción con ingredientes
  static async actualizarRelacionConIngredientes(pocionId, nuevosIngredientesIds) {
    try {
      // Obtener los ingredientes actuales de la poción
      const ingredientesActuales = await pocionesModel.obtenerIngredientesDePocion(pocionId);

      // Convertir los id de los ingredientes actuales a entero
      const nuevosIngredientesIdsNum = nuevosIngredientesIds.map(id => parseInt(id, 10));

      // Obtener los ingredientes que están en las relaciones actuales
      const ingredientesEliminar = ingredientesActuales.filter(ingrediente => !nuevosIngredientesIdsNum.includes(ingrediente.id));

      // Eliminar las relaciones existentes que no están en los nuevos ingredientes
      await pocionesModel.eliminarRelacionesIngredientes(pocionId, ingredientesEliminar);

      // Obtener los ingredientes que no están en las relaciones actuales
      const ingredientesAgregar = nuevosIngredientesIdsNum.filter(id => !ingredientesActuales.some(ingrediente => ingrediente.id === id));

      // Agregar las nuevas relaciones con los ingredientes
      await pocionesModel.relacionarPocionConIngredientes(pocionId, ingredientesAgregar);
    } catch (error) {
      console.log(`Hubo un error al actualizar la relación de la poción ${pocionId} con ingredientes:`, error);
      throw error;
    }
  }

  // Editar poción
  async editar(req, res) {
    const { id, nombre, descripcion, precio, cantidad, categoriaID, ingredientesIDs, imagenNueva } = req.body;
    console.log(ingredientesIDs);
    let imagen;
    let rutaImagen;
    if (req.file) {
      // Obtenemos la ruta de la imagen
      rutaImagen = req.file.path;
    }

    if (imagenNueva == "true") {
      // Obtenemos el nombre de la imagen
      imagen = path.basename(rutaImagen);
    }

    // Convertir los ingredientesIDs en un array
    const nuevosIngredientesIds = ingredientesIDs.split(',');

    // Verificar si nuevosIngredientesIds es un array válido
    if (!Array.isArray(nuevosIngredientesIds)) {
      return console.log('Los ingredientesIDs no son un array válido.');
    }

    try {
      // Verificar si la poción existe
      const pocionExistente = await PocionesController.validarPocionExistente(id);
      if (!pocionExistente) {
        borrarImagen(rutaImagen);
        return res.status(404).json({ status: 404, message: 'La poción especificada no existe.' });
      }

      // Verificar si ya existe una poción con el mismo nombre, excluyendo la poción actualmente editada
      const nombreExistente = await PocionesController.validarNombrePocionExistente(nombre);
      if (nombreExistente && nombreExistente.id != id) {
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
      const ingredientesExistentes = await PocionesController.validarIngredientesExistentes(nuevosIngredientesIds, cantidad);
      if (ingredientesExistentes.length !== nuevosIngredientesIds.length) {
        borrarImagen(rutaImagen);
        return res.status(400).json({ status: 400, message: 'Alguno(s) de los ingredientes especificados no existe(n).' });
      }

      // Restar la cantidad de pociones que se quieren crear a la cantidad de cada ingrediente utilizado
      for (const ingrediente of ingredientesExistentes) {
        await ingredientesModel.actualizarCantidad(ingrediente.id, ingrediente.cantidad - cantidad);
      }
      
      // Obtener el nombre de la imagen antigua
      const pocionAntigua = await pocionesModel.buscarPorId(id);
      const nombreImagenAntigua = pocionAntigua.imagen;

      // Construir la ruta completa de la imagen antigua
      const folder = `../../static/images/${nombreImagenAntigua}`;
      const rutaImagenAntigua = path.join(__dirname, folder);

      if (imagenNueva == "true") {
        // Eliminar la imagen antigua
        borrarImagen(rutaImagenAntigua);
      } else {
        // Borrar la imagen
        borrarImagen(rutaImagen);
        imagen = path.basename(rutaImagenAntigua);
      }

      // Actualizar la poción
      await pocionesModel.actualizar({ id, nombre, descripcion, precio, cantidad, imagen });
      // Actualizar la relación con la categoría
      await PocionesController.actualizarRelacionConCategoria(id, categoriaID);

      // Actualizar la relación con los ingredientes
      await PocionesController.actualizarRelacionConIngredientes(id, nuevosIngredientesIds);

      return res.status(200).json({ status: 200, message: 'Poción actualizada exitosamente.' });
    } catch (error) {
      return res.status(500).json({ status: 500, message: `Error al actualizar la poción: ${error}` });
    }
  }

  // Eliminar una poción
  async eliminar(req, res) {
    const { id } = req.params;
    try {
      // Verificar si la poción existe
      const pocionExistente = await PocionesController.validarPocionExistente(id);
      if (!pocionExistente) {
        return res.status(404).json({ status: 404, message: 'Poción no encontrada.' });
      }

      // Obtener los datos de la poción
      const pocion = await pocionesModel.buscarPorId(id);

      // Obtener la categoría
      const categoriaEliminar = pocion.categoria;

      // Eliminar la relación existente con la categoría
      await pocionesModel.eliminarRelacionPocionCategoria(id, categoriaEliminar);

      // Obtener los ingredientes
      const ingredientesEliminar = pocion.ingredientes;

      // Eliminar las relaciones existentes con los ingredientes
      await pocionesModel.eliminarRelacionesIngredientes(id, ingredientesEliminar);

      // Obtener el nombre de la imagen
      const nombreImagen = pocion.imagen;

      // Construir la ruta completa de la imagen
      const folder = `../../static/images/${nombreImagen}`;
      const rutaImagen = path.join(__dirname, folder);

      // Eliminar imagen
      borrarImagen(rutaImagen);

      // Eliminar la poción de la base de datos
      await pocionesModel.eliminar(id);
      res.status(200).json({ status: 200, message: 'Poción eliminada exitosamente.' });
    } catch (error) {
      res.status(500).json({ status: 500, message: `Error al eliminar la poción: ${error}` });
    }
  }
}

// Exportación de las funciones
const pocionesC = new PocionesController();
module.exports = pocionesC;