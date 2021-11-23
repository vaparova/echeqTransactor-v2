import { DatosEntidad } from './datosEntidad';
import { DatosCuenta } from './datosCuenta';
export class DatosBeneficiario{
    cuilBeneficiario: number;
    nombreBeneficiario: string;
    datosCuenta ?: DatosCuenta;
    DatosEntidad ?: DatosEntidad;

    constructor(cuilBeneficiario: number, nombreBeneficiario: string){
        this.cuilBeneficiario = cuilBeneficiario;
        this.nombreBeneficiario = nombreBeneficiario;
    }

    setDatosDepositaria(cta: DatosCuenta, ent: DatosEntidad){
        this.datosCuenta = cta;
        this.DatosEntidad = ent;
    }
}
