import { Router, Request, Response} from 'express';
import { ResponseDni } from '../interfaces/ResponseDni';
import { UserData } from '../interfaces/UserData';
const business = require('../bll/dniCuit');

const router = Router();

//Este es el endpoint principal, cumple el propósito de la app
router.get('/get-user-data/:dni', (req: Request, res: Response) => {
    console.log(`DNI ${req.params.dni} recibido, esperando respuesta`);
    //Envío el DNI para obtener CUIT
    business.convertDniToCuit(req.params.dni).then( (responseDni: ResponseDni) => {//si todo sale bien:
      console.log('respuesta DNI -->', responseDni);
        console.log('el CUIT produccion es', responseDni.data.cuit);
        //envío el CUIT para obtener data del usuario
        business.getUserDataByCuit(responseDni.data.cuit).then( (UserData: UserData) =>{
          console.log('respuesta CUIT--->', UserData);
          res.status(200).json(UserData);
        }).catch( (error: object) => {
          console.log('Error al obtener datos de usuario -->', error);
          res.status(500).json({
            success: false,
            description: "Error al obtener datos de usuario",
            error
          });
        });
    }).catch( (error: object) => {//FALLÓ la consulta de DNI
      console.log('Error al consultar DNI -->', error);
      res.status(500).json({
        success: false,
        description: "El DNI no se encuentra registrado",
        error
      });
    });
});

//Endpoint de prueba para la conversión de DNI a CUIT
router.get('/test/convert-dni/:dni', (req: Request, res: Response) => {
  if (req.params.dni) {
    console.log(`DNI ${req.params.dni} recibido, esperando respuesta`);
    business.convertDniToCuit(req.params.dni).then( (data: object) => {
      console.log('respuesta -->', data);
      res.status(200).json(data);
    }).catch( (error: any) => {
      console.log(error);
      res.status(500).json({
        success: false,
        error
      });
    });
  } else {//just in case of network intersection
    res.status(500).send('No se recibió ningún DNI')
  };
});
//Endpoint de prueba para obtener datos del usuario
router.get('/test/get-user-data-by-cuit/:cuit', (req: Request, res: Response) => {
  if (req.params.cuit) {
    console.log(`CUIT ${req.params.cuit} recibido, esperando respuesta`);
    business.getUserDataByCuit(req.params.cuit).then( (data: object) =>{
      console.log('respuesta --->', data);
      res.status(200).json(data);
    }).catch( (error: any) => {
      console.log(error);
      res.status(500).json({
        success: false,
        error
      });
    });
  } else {//just in case of network intersection
    res.status(500).send('No se ha recibido ningún CUIT');
  };
});

export default router;