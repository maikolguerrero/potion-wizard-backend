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
}

const categoriasM = new CategoriasModel();
module.exports = categoriasM;
