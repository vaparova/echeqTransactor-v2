import { DatosPersonales } from './datosPersonales';
import { DatosPostales } from './datosPostales';
export class DatosUsuario{

    usuario: {
        datosPersonales: DatosPersonales,
        datosPostales: DatosPostales
    };

    constructor(pers: DatosPersonales, post: DatosPostales){
       this.usuario = {
           datosPersonales: pers,
           datosPostales: post
       };
    }
}
