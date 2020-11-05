import { DatosBeneficiario } from './datosBeneficiario';
import { DatosEndoso } from './datosEndoso';
import { DatosRechazo } from './datosRechazo';

export class DatosEcheq{
    idEcheq: string;
    nroEcheq: number;
    estadoEcheq: string;
    fechaEmision: Date;
    fechaPago: Date;
    montoEcheq: number;
    beneficiario: DatosBeneficiario;
    endososEcheq: DatosEndoso[];
    rechazado: boolean;
    estadoCac: boolean;
    cac: {};
    datosRechazo: DatosRechazo[];

    constructor(idEcheq: string,
                nroEcheq: number,
                estadoEcheq: string,
                fechaEmision: Date,
                fechaPago: Date,
                montoEcheq: number,
                beneficiario: DatosBeneficiario){

        this.idEcheq = idEcheq;
        this.nroEcheq = nroEcheq;
        this.estadoEcheq = estadoEcheq;
        this.fechaEmision = fechaEmision;
        this.fechaPago = fechaPago;
        this.montoEcheq = montoEcheq;
        this.beneficiario = beneficiario;

    }

}
