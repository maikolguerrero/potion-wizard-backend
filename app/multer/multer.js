const fs = require('fs');
const path = require('path');

const multer = require('multer');
const directorioStatic = './static';
const directotioImages = './static/images';

// Verificar si el directorio de la carpeta static existe
if (!fs.existsSync(directorioStatic)) {
    // El directorio no existe, así que lo creamos
    fs.mkdirSync(directorioStatic);
}

// Verificar si el directorio de la carpeta images existe
if (!fs.existsSync(directotioImages)) {
    // El directorio no existe, así que lo creamos
    fs.mkdirSync(directotioImages);
}

// Configuración del almacenamiento de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = 'static/images';
        const destinationPath = path.join(__dirname, folder);
        fs.mkdirSync(destinationPath, { recursive: true });
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        // Generar un nombre único para el archivo utilizando el timestamp actual
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Función para borrar la imagen
function borrarImagen(imagen) {
    // Borrar la imagen en caso de error
    if (imagen) {
        fs.unlink(imagen, (err) => {
            if (err) {
                console.log(`Error al borrar la imagen: ${err}`);
            }
        });
    }
}

// Configuración del middleware de multer para subir archivos
const upload = multer({ storage: storage });

module.exports = { upload, borrarImagen };