// Importamos la función para poder realizar las consultas a la BD
const realizarConsulta = require('../../config/consulta')

class PocionesModel {
    // Mostrar lista de las pociones
    async listar() {
        const sql = 'SELECT * FROM pociones';
        try {
          const pociones = await realizarConsulta(sql);
          return pociones;
        } catch (error) {
          console.log('Hubo un error al obtener las pociones:', error);
          throw error;
        }
    }
}

const pocionesM = new PocionesModel();
module.exports = pocionesM;
