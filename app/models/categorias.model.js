// Importamos la función para poder realizar las consultas a la BD
const realizarConsulta = require('../../config/consulta')

class CategoriasModel {
  // Mostrar lista de las categorias
  async listar() {
    const sql = 'SELECT * FROM categorias';
    try {
      const categorias = await realizarConsulta(sql);
      return categorias;
    } catch (error) {
      console.log('Hubo un error al obtener las categorias:', error);
      throw error;
    }
  }

  // Mostrar categoría por id
  async buscarPorId(id) {
    const sql = 'SELECT * FROM categorias WHERE id = ?';
    const values = [id];
    try {
      const [categoria] = await realizarConsulta(sql, values);
      return categoria;
    } catch (error) {
      console.log(`Hubo un error al buscar la categoría con ID ${id}:`, error);
      throw error;
    }
  }

   // Mostrar categoría por nombre
   async buscarPorNombre(nombre) {
    const sql = 'SELECT * FROM categorias WHERE nombre = ?';
    const values = [nombre];
    try {
      const [categoria] = await realizarConsulta(sql, values);
      return categoria;
    } catch (error) {
      console.log(`Hubo un error al buscar la categoría con nombre ${nombre}:`, error);
      throw error;
    }
  }
}

const categoriasM = new CategoriasModel();
module.exports = categoriasM;
