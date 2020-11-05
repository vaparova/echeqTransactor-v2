import { DatosEntidad } from './datosEntidad';
import { DatosCuenta } from './datosCuenta';

export class DatosCuentas {
        cuentas: {
        entidad: DatosEntidad,
        cuenta: DatosCuenta,
        estado: boolean,
        claveActivación: string,
        chequeras: [];
    };

    constructor(banco: DatosEntidad, cta: DatosCuenta, clave: string){
        this.cuentas = {
            entidad: banco,
            cuenta: cta,
            estado: false,
            claveActivación: clave,
            chequeras: []
        };
    }
}
