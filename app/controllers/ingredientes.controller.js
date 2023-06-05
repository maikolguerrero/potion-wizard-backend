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

    // Mostrar ingrediente por id
    async buscarPorId(req, res) {
        const { id } = req.params;
        try {
            const ingrediente = await ingredientesModel.buscarPorId(id);
            if (!ingrediente) {
                return res.status(404).json({ status: 404, message: 'Ingrediente no encontrado.' });
            }
            res.status(200).json({ status: 200, message: 'Ingrediente encontrado.', data: ingrediente });
        } catch (error) {
            res.status(500).json({ status: 500, message: `Error al buscar el ingrediente: ${error}` });
        }
    }

    // Mostrar ingredientes por nombre
    async buscarPorNombre(req, res) {
        const { nombres } = req.params;
        try {
            const nombresIngredientes = nombres.split(',').map(nombre => nombre.trim());
            const ingredientesEncontrados = await Promise.all(nombresIngredientes.map(nombre => ingredientesModel.buscarPorNombre(nombre)));

            res.status(200).json({ status: 200, message: 'Ingredientes encontrados.', data: ingredientesEncontrados });
        } catch (error) {
            res.status(500).json({ status: 500, message: `Error al buscar los ingredientes: ${error}` });
        }
    }
}

// Exportación de las funciones
const ingredientesC = new IngredientesController();
module.exports = ingredientesC;