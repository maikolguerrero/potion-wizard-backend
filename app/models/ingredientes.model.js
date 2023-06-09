// Importamos la función para poder realizar las consultas a la BD
const realizarConsulta = require('../../config/consulta')

class IngredientesModel {
  // Mostrar lista de los ingredientes
  async listar() {
    const sql = 'SELECT * FROM ingredientes';
    try {
      const ingredientes = await realizarConsulta(sql);
      return ingredientes;
    } catch (error) {
      console.log('Hubo un error al obtener los ingredientes:', error);
      throw error;
    }
  }

  // Mostrar ingrediente por id
  async buscarPorId(id) {
    const sql = 'SELECT * FROM ingredientes WHERE id = ?';
    const values = [id];
    try {
      const [ingredientes] = await realizarConsulta(sql, values);
      return ingredientes;
    } catch (error) {
      console.log(`Hubo un error al buscar el ingrediente con ID ${id}:`, error);
      throw error;
    }
  }

  // Mostrar ingredientes por nombre
  async buscarPorNombre(nombre) {
    const sql = 'SELECT * FROM ingredientes WHERE nombre = ?';
    const values = [nombre];
    try {
      const [ingrediente] = await realizarConsulta(sql, values);
      return ingrediente;
    } catch (error) {
      console.log(`Hubo un error al buscar el ingrediente con nombre ${nombre}:`, error);
      throw error;
    }
  }

  // Actualizar la cantidad del ingrediente restando 1 en la cantidad
  async actualizarCantidad(ingredienteId, nuevaCantidad) {
    const sql = 'UPDATE ingredientes SET cantidad = ? WHERE id = ?';
    try {
      await realizarConsulta(sql, [nuevaCantidad, ingredienteId]);
    } catch (error) {
      console.log(`Hubo un error al actualizar la cantidad del ingrediente ${ingredienteId}:`, error);
      throw error;
    }
  }

}

const ingredientesM = new IngredientesModel();
module.exports = ingredientesM;
