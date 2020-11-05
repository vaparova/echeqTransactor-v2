import { DatosPersonales } from './datosPersonales';
import { DatosPostales } from './datosPostales';
import { DatosIngreso } from './datosIngreso';
import { DatosToken } from './datosToken';
import { DatosCuentas } from './datosCuentas';

export class DatosUsuario{

    usuario: {
        datosPersonales: DatosPersonales,
        datosPostales: DatosPostales,
        datosIngreso: DatosIngreso,
        datosToken: DatosToken,
        datosCuentas: DatosCuentas[]
    };

    constructor(pers: DatosPersonales, post: DatosPostales, ing: DatosIngreso){
       this.usuario = {
           datosPersonales: pers,
           datosPostales: post,
           datosIngreso: ing,
           datosToken: new DatosToken(),
           datosCuentas: []
       };
    }
}
