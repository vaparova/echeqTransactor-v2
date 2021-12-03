import { DatosEntidad } from './datosEntidad';
import { DatosCuenta } from './datosCuenta';
import { DatosChequeras } from './datosChequeras';

export class DatosCuentas {
        cuentas: {
        entidad: DatosEntidad,
        cuenta: DatosCuenta,
        estado: boolean,
        claveActivacion: string,
        chequeras: DatosChequeras[];
        limiteCredito: number;
    };

    constructor(banco: DatosEntidad, cta: DatosCuenta, clave: string){
        this.cuentas = {
            entidad: banco,
            cuenta: cta,
            estado: false,
            claveActivacion: clave,
            chequeras: [],
            limiteCredito: 200000
        };
    }
}
