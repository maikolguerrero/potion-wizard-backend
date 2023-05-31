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
}

// Exportación de las funciones
const pocionesC = new PocionesController();
module.exports = pocionesC;