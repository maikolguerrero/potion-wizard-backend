// Definimos la constante categoriasModel para poder obtener los datos de la BD
const categoriasModel = require('../models/categorias.model');

class CategoriasController {
  // Mostrar lista de las categorias
  async listar(req, res) {
    try {
      const categorias = await categoriasModel.listar();
      res.status(200).json({ status: 200, message: 'Se obtuvieron las categorias exitosamente.', data: categorias });
    } catch (error) {
      res.status(500).json({ status: 500, message: `Error al obtener las categorias: ${error.message}` });
    }
  }

  // Mostrar categoria por id
  async buscarPorId(req, res) {
    const { id } = req.params;
    try {
      const categoria = await categoriasModel.buscarPorId(id);
      if (!categoria) {
        return res.status(404).json({ status: 404, message: 'Categoría no encontrada.' });
      }
      res.status(200).json({ status: 200, message: 'Categoría encontrada.', data: categoria });
    } catch (error) {
      res.status(500).json({ status: 500, message: `Error al buscar la categoría: ${error}` });
    }
  }
}

// Exportación de las funciones
const categoriasC = new CategoriasController();
module.exports = categoriasC;