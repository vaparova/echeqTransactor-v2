import { DatosPersonales } from './datosPersonales';
import { DatosPostales } from './datosPostales';
import { DatosIngreso } from './datosIngreso';
import { DatosToken } from './datosToken';
import { DatosCuentas } from './datosCuentas';
import { DatosAlertas } from './datosAlertas';

export class DatosUsuario{

    usuario: {
        datosPersonales: DatosPersonales,
        datosPostales: DatosPostales,
        datosIngreso: DatosIngreso,
        datosToken: DatosToken,
        datosCuentas: DatosCuentas[],
        datosAlertas?: DatosAlertas[]
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
