import { DatosEcheq } from './datosEcheq';

export class DatosChequeras{
    estadoPedido: boolean;
    estadoChequera: boolean;
    codigoActivacion: string;
    nroPrimerEcheq: number;
    cantidadEcheq: number;
    cantidadDisponible: number;
    echeq: DatosEcheq [];

    constructor(){
        this.estadoPedido = false;
        this.estadoChequera = false;
        this.codigoActivacion = null;
        this.nroPrimerEcheq = null;
        this.cantidadEcheq = null;
        this.cantidadDisponible = null;
        this.echeq = [];
    }

    crearChequera(nroPrimerEcheq: number, codigoActivacion: string){
        this.estadoPedido = true;
        this.estadoChequera = false;
        this.codigoActivacion = codigoActivacion;
        this.nroPrimerEcheq = nroPrimerEcheq;
        this.cantidadEcheq = 50;
        this.cantidadDisponible = 50;
        this.echeq = [];
    }
}
