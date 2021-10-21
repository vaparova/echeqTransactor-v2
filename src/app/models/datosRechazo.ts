export class DatosRechazo{
    codigoRechazo: string;
    motivoRechazo: string;
    fechaRechazo: Date;

    constructor(codigoRechazo: string, motivoRechazo: string, fechaRechazo: Date){
        this.codigoRechazo = codigoRechazo;
        this.motivoRechazo = motivoRechazo;
        this.fechaRechazo = fechaRechazo;
    }
}
