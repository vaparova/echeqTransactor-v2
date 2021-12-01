import { DatosBeneficiario } from './datosBeneficiario';
import { DatosEndoso } from './datosEndoso';
import { DatosRechazo } from './datosRechazo';
import { DatosEstadoEcheq } from './datosEstadoEcheq';

export class DatosEcheq{
    idEcheq: string;
    nroEcheq: number;
    estadoEcheq: string;
    fechaEmision: Date;
    fechaPago: Date;
    montoEcheq: number;
    beneficiario: DatosBeneficiario;
    // tenedor: DatosBeneficiario;
    motivo: string;
    referencia: string;
    endososEcheq: DatosEndoso[] = [];
    rechazado: boolean;
    estadoCac: boolean;
    cac: {};
    datosRechazo: DatosRechazo[] = [];

    constructor(
                nroEcheq: number,
                estadoEcheq: number,
                fechaEmision: Date,
                fechaPago: Date,
                montoEcheq: number,
                motivo: string,
                referencia: string,
                beneficiario: DatosBeneficiario,
                ){

        this.idEcheq = this.crearIdEcheq();
        this.nroEcheq = nroEcheq;
        this.estadoEcheq = this.cambiarEstadoEcheq(estadoEcheq);
        this.fechaEmision = fechaEmision;
        this.fechaPago = fechaPago;
        this.montoEcheq = montoEcheq;
        this.motivo = motivo;
        this.referencia = referencia;
        this.beneficiario = beneficiario;
        // this.tenedor = tenedor;

    }

    cambiarEstadoEcheq(idx: number): string{
        const estado = new DatosEstadoEcheq();
        return estado.getEstado(idx);
    }

    private crearIdEcheq(): string{
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 15; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }


}
