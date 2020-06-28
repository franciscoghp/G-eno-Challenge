import Server from './server/server';
import router from './routes/router'

//invoco la configuración del sistema
const config = require('./config/config.json');

const bodyParser = require('body-parser');

/*---Levanto el servidor de express---*/
const server = Server.init(config.port);
/*------------------------------------*/

/*---SERVER MIDLEWARES---*/

//formatear los body request con application/x-www-form-urlencoded
server.app.use(bodyParser.urlencoded({ extended: false }))

//formatear los body request con application/json
server.app.use(bodyParser.json())

//configuro CORS, just in case
server.app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS');
  next();
});

/*----Archivo RUTAS------*/
server.app.use('/api', router);
/* ---------------------*/

/*----Arranco el servidor----*/
server.start( () => {
  console.log('runing in port', config.port);
})
/*---------------------------*/

module.exports = config;
