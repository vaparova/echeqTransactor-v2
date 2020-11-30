import { DatosEcheq } from './datosEcheq';

export class DatosChequeras{
    estadoPedido: boolean;
    estadoChequera: boolean;
    codigoActivacion: string;
    nroPrimerEcheq: number;
    cantidadEcheq: number;
    cantidadDisponible: number;
    echeq: DatosEcheq [];

    constructor(nroPrimerEcheq: number, codigoActivacion: string){
        this.estadoPedido = false;
        this.estadoChequera = false;
        this.codigoActivacion = codigoActivacion;
        this.nroPrimerEcheq = nroPrimerEcheq;
        this.cantidadEcheq = 50;
        this.cantidadDisponible = 50;
        this.echeq = [];
    }
}
