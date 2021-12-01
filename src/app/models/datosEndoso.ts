import { DatosBeneficiario } from './datosBeneficiario';
export class DatosEndoso {
    endosante: DatosBeneficiario; // quien cede
    endosatario: DatosBeneficiario; // quien recibe

    constructor(endosante: DatosBeneficiario, endosatario: DatosBeneficiario){
        this.endosante = endosante;
        this.endosatario = endosatario;
    }
}
