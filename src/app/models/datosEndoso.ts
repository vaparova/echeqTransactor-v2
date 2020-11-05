import { DatosBeneficiario } from './datosBeneficiario';
export class DatosEndoso {
    endosante: DatosBeneficiario;
    endosatario: DatosBeneficiario;

    constructor(endosante: DatosBeneficiario, endosatario: DatosBeneficiario){
        this.endosante = endosante;
        this.endosatario = endosatario;
    }
}
