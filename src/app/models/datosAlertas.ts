import { DatosCoelsa } from './datosCoelsa';
export class DatosAlertas{
    title: string;
    detalle: string;
    echeq: DatosCoelsa;
    leido: boolean;

    constructor(tit: string, det: string, echeq: DatosCoelsa){
        this.title = tit;
        this.detalle = det;
        this.echeq = echeq;
        this.leido = false;
    }
}
