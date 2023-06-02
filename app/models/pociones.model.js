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
            categoria: row.categoria ? row.categoria : 'No hay categoría',
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
            categoria: row.categoria ? row.categoria : 'No hay categoría',
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

  // Buscar poción por su nombre
  async buscarPorNombre(nombre) {
    const sql = 'SELECT * FROM pociones WHERE nombre = ?';
    const values = [nombre];
    try {
      const [pocion] = await realizarConsulta(sql, values);
      return pocion;
    } catch (error) {
      console.log(`Hubo un error al buscar la poción con nombre ${nombre}:`, error);
      throw error;
    }
  }

  // Buscar poción por su nombre
  async buscarPorImagen(imagen) {
    const sql = 'SELECT * FROM pociones WHERE imagen = ?';
    const values = [imagen];
    try {
      const [pocion] = await realizarConsulta(sql, values);
      return pocion;
    } catch (error) {
      console.log(`Hubo un error al buscar la poción con la imagen ${imagen}:`, error);
      throw error;
    }
  }

  // Relacionar una poción con categorías
  async relacionarPocionConCategorias(pocionId, categoriaId) {
    const sql = 'INSERT INTO pociones_categorias (id_pocion, id_categoria) VALUES (?, ?)';
    try {
      await realizarConsulta(sql, [pocionId, categoriaId]);
    } catch (error) {
      console.log(`Hubo un error al relacionar la poción ${pocionId} con las categorías:`, error);
      throw error;
    }
  }

  // Relacionar una poción con ingredientes
  async relacionarPocionConIngredientes(pocionID, ingredientesIDs) {
    const sql = 'INSERT INTO pociones_ingredientes (id_pocion, id_ingrediente) VALUES (?, ?)';
    try {
      for (const ingredienteIDs of ingredientesIDs) {
        await realizarConsulta(sql, [pocionID, ingredienteIDs]);
      }
    } catch (error) {
      console.log(`Hubo un error al relacionar la poción ${pocionID} con los ingredientes:`, error);
      throw error;
    }
  }

  // Actualizar la relación de una poción con categoría
  async actualizarRelacionConCategoria(pocionId, nuevaCategoriaId) {
    const sql = 'UPDATE pociones_categorias SET id_categoria = ? WHERE id_pocion = ?';
    const values = [nuevaCategoriaId, pocionId];
    try {
      await realizarConsulta(sql, values);
    } catch (error) {
      console.log(`Hubo un error al actualizar la relación de la poción ${pocionId} con la categoría:`, error);
      throw error;
    }
  }

  // Obtener los ingredientes de una poción
  async obtenerIngredientesDePocion(pocionId) {
    const sql = 'SELECT id_ingrediente AS id FROM pociones_ingredientes WHERE id_pocion = ?';
    const values = [pocionId];
    try {
      const rows = await realizarConsulta(sql, values);
      return rows.map(row => ({ id: row.id }));
    } catch (error) {
      console.log(`Hubo un error al obtener los ingredientes de la poción ${pocionId}:`, error);
      throw error;
    }
  }

  // Eliminar las relaciones de una poción con ingredientes específicos
  async eliminarRelacionesIngredientes(pocionId, ingredientesEliminar) {
    const sql = 'DELETE FROM pociones_ingredientes WHERE id_pocion = ? AND id_ingrediente = ?';
    try {
      for (const ingrediente of ingredientesEliminar) {
        await realizarConsulta(sql, [pocionId, ingrediente.id]);
      }
    } catch (error) {
      console.log(`Hubo un error al eliminar las relaciones de la poción ${pocionId} con los ingredientes:`, error);
      throw error;
    }
  }

  // Crear una nueva poción
  async crear(pocion) {
    const { nombre, descripcion, precio, cantidad, imagen } = pocion;
    const sql = 'INSERT INTO pociones (nombre, descripcion, precio, cantidad, imagen) VALUES (?, ?, ?, ?, ?)';
    const values = [nombre, descripcion, precio, cantidad, imagen];
    try {
      const resultado = await realizarConsulta(sql, values);
      const nuevaPocionId = resultado.insertId;
      return nuevaPocionId;
    } catch (error) {
      console.log('Hubo un error al crear la poción:', error);
      throw error;
    }
  }

  // Editar poción
  async actualizar(pocion) {
    const { id, nombre, descripcion, precio, cantidad, imagen } = pocion;
    const sql = 'UPDATE pociones SET nombre = ?, descripcion = ?, precio = ?, cantidad = ?, imagen = ? WHERE id = ?';
    const values = [nombre, descripcion, precio, cantidad, imagen, id];
    try {
      await realizarConsulta(sql, values);
    } catch (error) {
      console.log(`Hubo un error al actualizar la poción con el ID ${id}:`, error);
      throw error;
    }
  }
}

const pocionesM = new PocionesModel();
module.exports = pocionesM;
