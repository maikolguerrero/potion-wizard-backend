// Importación de app
const app = require('./app/app');

// Levantar el servidor
app.listen(app.get('port'), (err) => {
    if(err) {
        console.log(`Hubo un error : ${err}`)
    }else {
        console.log(`Servidor iniciado en el puerto ${app.get('port')}`)
    }
});