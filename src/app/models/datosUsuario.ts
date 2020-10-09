import { DatosPersonales } from './datosPersonales';
import { DatosPostales } from './datosPostales';
export class DatosUsuario{

    usuario: {
        datosPersonales: DatosPersonales,
        datosPostales: DatosPostales
    };
        // const pers = new DatosPersonales(
        //     'Martín',
        //     'Molina',
        //     'servicebelgrano@hotmail.com',
        //     20277852536,
        //     155874932
        // );
        // const post = new DatosPostales(
        //     'belgrano',
        //     519,
        //     'Godoy Cruz',
        //     'Mendoza',
        //     5501
        // );
        // this.nuevoUsuario(pers, post);


    constructor(pers: DatosPersonales, post: DatosPostales){
        this.usuario.datosPersonales = pers;
        this.usuario.datosPostales = post;
    }
}
