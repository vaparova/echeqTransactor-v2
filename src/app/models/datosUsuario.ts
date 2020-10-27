import { DatosPersonales } from './datosPersonales';
import { DatosPostales } from './datosPostales';
import { DatosIngreso } from './datosIngreso';

export class DatosUsuario{

    usuario: {
        datosPersonales: DatosPersonales,
        datosPostales: DatosPostales,
        datosIngreso: DatosIngreso
    };

    constructor(pers: DatosPersonales, post: DatosPostales, ing: DatosIngreso){
       this.usuario = {
           datosPersonales: pers,
           datosPostales: post,
           datosIngreso: ing
       };
    }
}
