// Definimos la constante pocionesModel para poder obtener los datos de la BD
const pocionesModel = require('../models/pociones.model');

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
}

// Exportación de las funciones
const pocionesC = new PocionesController();
module.exports = pocionesC;