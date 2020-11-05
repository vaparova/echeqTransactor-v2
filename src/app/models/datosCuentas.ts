import { DatosEntidad } from './datosEntidad';
import { DatosCuenta } from './datosCuenta';
import { DatosChequeras } from './datosChequeras';

export class DatosCuentas {
        cuentas: {
        entidad: DatosEntidad,
        cuenta: DatosCuenta,
        estado: boolean,
        claveActivación: string,
        chequeras: DatosChequeras[];
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
