// Definimos la constante ingredientesModel para poder obtener los datos de la BD
const ingredientesModel = require('../models/ingredientes.model');

class IngredientesController {
    // Mostrar lista de los ingredientes
    async listar(req, res) {
        try {
            const ingredientes = await ingredientesModel.listar();
            res.status(200).json({ status: 200, message: 'Se obtuvieron los ingredientes exitosamente.', data: ingredientes });
        } catch (error) {
            res.status(500).json({ status: 500, message: `Error al obtener los ingredientes: ${error.message}` });
        }
    }
}

// Exportación de las funciones
const ingredientesC = new IngredientesController();
module.exports = ingredientesC;