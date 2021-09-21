export class DatosBeneficiario{
    cuilBeneficiario: number;
    nombreBeneficiario: string;
    email: string;

    constructor(cuilBeneficiario: number, nombreBeneficiario: string, email: string){
        this.cuilBeneficiario = cuilBeneficiario;
        this.nombreBeneficiario = nombreBeneficiario;
        this.email = email;
    }
}
