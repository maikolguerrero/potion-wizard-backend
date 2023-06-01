// Importamos la función para poder realizar las consultas a la BD
const realizarConsulta = require('../../config/consulta')

class PocionesModel {
  constructor() {
    // sql para mostrar las pociones con todos sus datos, incluyendo categoría e ingredientes
    this.sqlPocion = `
    SELECT p.*, c.nombre AS categoria, i.nombre AS ingrediente
    FROM pociones p
    LEFT JOIN pociones_categorias pc ON p.id = pc.id_pocion
    LEFT JOIN categorias c ON c.id = pc.id_categoria
    LEFT JOIN pociones_ingredientes pi ON p.id = pi.id_pocion
    LEFT JOIN ingredientes i ON i.id = pi.id_ingrediente
  `;
  }

  // Mostrar lista de las pociones
  async listar() {
    const sql = this.sqlPocion;
    try {
      const results = await realizarConsulta(sql);
      const pociones = [];

      results.forEach((row) => {
        const pocion = pociones.find((p) => p.id === row.id);
        if (pocion) {
          pocion.ingredientes.push(row.ingrediente);
        } else {
          pociones.push({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            precio: row.precio,
            cantidad: row.cantidad,
            imagen: row.imagen,
            categoria: row.categoria ? [row.categoria] : 'No hay categoría',
            ingredientes: row.ingrediente ? [row.ingrediente] : []
          });
        }
      });

      return pociones;
    } catch (error) {
      console.log('Hubo un error al obtener las pociones:', error);
      throw error;
    }
  }

  // Mostrar categoría por id
  async buscarPorId(id) {
    const sql = `
    ${this.sqlPocion}
    WHERE p.id = ?
  `;
    const values = [id];
    try {
      const results = await realizarConsulta(sql, values);
      if (results.length === 0) {
        return null; // Poción no encontrada
      }

      const pocion = {
        id: results[0].id,
        nombre: results[0].nombre,
        descripcion: results[0].descripcion,
        precio: results[0].precio,
        cantidad: results[0].cantidad,
        imagen: results[0].imagen,
        categoria: results[0].categoria ? results[0].categoria : 'No hay categoría',
        ingredientes: []
      };

      results.forEach((row) => {
        if (row.ingrediente) {
          pocion.ingredientes.push(row.ingrediente);
        }
      });
      return pocion;
    } catch (error) {
      console.log(`Hubo un error al buscar la poción con ID ${id}:`, error);
      throw error;
    }
  }

  // Mostrar categorías con búsqueda por nombre, descripción y categoría
  async buscarPorTerminos(terminos) {
    const sql = `
      SELECT p.*, c.nombre AS categoria
      FROM pociones AS p
      LEFT JOIN pociones_categorias AS pc ON p.id = pc.id_pocion
      LEFT JOIN categorias AS c ON pc.id_categoria = c.id
      WHERE p.nombre LIKE ? OR p.descripcion LIKE ? OR c.nombre LIKE ?
    `;
    const values = [`%${terminos}%`, `%${terminos}%`, `%${terminos}%`];
    try {
      const rows = await realizarConsulta(sql, values);
      if (rows.length === 0) {
        return null; // Poción no encontrada
      }
      const pociones = [];

      rows.forEach((row) => {
        const pocion = pociones.find((p) => p.id === row.id);
        if (pocion) {
          pocion.categoria.push(row.categoria);
        } else {
          pociones.push({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            precio: row.precio,
            cantidad: row.cantidad,
            imagen: row.imagen,
            categoria: row.categoria ? [row.categoria] : 'No hay categoría',
            ingredientes: row.ingrediente ? [row.ingrediente] : []
          });
        }
      });

      return pociones;
    } catch (error) {
      console.log('Hubo un error al buscar las pociones por términos:', error);
      throw error;
    }
  }

}

const pocionesM = new PocionesModel();
module.exports = pocionesM;
