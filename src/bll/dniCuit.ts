import moment from 'moment';
import { ResponseDni } from '../interfaces/ResponseDni';
import { ResponseCuit } from '../interfaces/ResponseCuit';
import { UserData } from '../interfaces/UserData';

const axios = require("axios");
const config = require("../config/config.json")

module.exports = {
  //convierte un DNI valido en un CUIT valido
  convertDniToCuit: (dni: string) => {
    return new Promise((resolve, reject) => {
      const endpoint = `${config.api.endpoint1}/${dni}`;
      axios
        .get(endpoint)
        .then((response: ResponseDni) => {
          resolve(response.data);
        })
        .catch((error: object) => {
          reject(error);
        });
    });
  },
  //obtiene datos del usuario segun CUIT
  getUserDataByCuit: (cuit: number) => {
    // const cuitString = cuit.toString();
    return new Promise((resolve, reject) => {
      const endpoint = `${config.api.endpoint2}/${cuit}`;
      axios
        .get(endpoint)
        .then((response: ResponseCuit) => {
          const responseCuit = mapearCuitResponse( cuit, response.data);
          resolve(responseCuit);
        })
        .catch((error: object) => {
          reject(error);
        });
    });
  },
};

//---Algunos Utils par ayudar a los métodos principales:
//para entregar datos simples al front
const mapearCuitResponse = ( cuit: number, dataToMap:any) => {
  const dataMapeada = {
    fullName: dataToMap.data.name + ' ' + dataToMap.data.surname,
    birthday: formatearFecha(dataToMap.data.birthday),
    scoring: (dataToMap.data.scoring.approved) ? 'APROBADO' : 'RECHAZADO',
    cuit
  }
  return dataMapeada
}
//para llevar el dato fecha al formato requerido
const formatearFecha = (fecha:any) => {
  let fechaAux = moment(fecha, "YYYY-MM-DDTHH:mm:ss.sssZ").locale('es').format("DD-MMMM-YYYY");
  //capitalizamos la primera letra del mes
  const fechaFormateada = fechaAux.slice(0,3) + fechaAux.charAt(3).toUpperCase() + fechaAux.slice(4);
  //cambiamos los guiones por conectivo 'de', se pudo concatenar arriba, pero esto es más cool
  const regEx = /-/gi;
  return fechaFormateada.replace(regEx, ' de ');
}