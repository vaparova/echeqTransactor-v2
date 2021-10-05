import { DatosEcheq } from './datosEcheq';
import { DatosCuenta } from './datosCuenta';
import { DatosEntidad } from './datosEntidad';
import { DatosTitularEcheq } from './datosTitularEcheq';


export class DatosCoelsa{
    datosEcheq: DatosEcheq;
    datosCuenta: DatosCuenta;
    datosEntidad: DatosEntidad;
    datosTitularEcheq: DatosTitularEcheq;

    constructor(datosEcheq: DatosEcheq, datosCuenta: DatosCuenta, datosEntidad: DatosEntidad, datosTitularEcheq: DatosTitularEcheq){
        this.datosEcheq = datosEcheq;
        this.datosCuenta = datosCuenta;
        this.datosEntidad = datosEntidad;
        this.datosTitularEcheq = datosTitularEcheq;
    }
}
