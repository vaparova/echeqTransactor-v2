import { DatosEcheq } from './datosEcheq';

export class DatosChequeras{
    estadoChequera: boolean;
    codigoActivacion: string;
    nroPrimerEcheq: number;
    cantidadEcheq: number;
    cantidadDisponible: number;
    Echeq: DatosEcheq [];

    constructor(nroPrimerEcheq: number, codigoActivacion: string){
        this.estadoChequera = false;
        this.codigoActivacion = codigoActivacion;
        this.nroPrimerEcheq = nroPrimerEcheq;
        this.cantidadEcheq = 50;
        this.cantidadDisponible = 50;
        this.Echeq = [];
    }
}
