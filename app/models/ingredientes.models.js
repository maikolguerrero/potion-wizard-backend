// Importamos la función para poder realizar las consultas a la BD
const { realizarConsulta } = require('../../config/consulta')

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
}

const ingredientesM = new IngredientesModel();
module.exports = ingredientesM;
