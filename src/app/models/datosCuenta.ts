export class DatosCuenta {
    cbu: string;
    tipoCuenta: string;
    numeroCuenta: string;
    denominacion: string;

    constructor(cbu: string, tipoCuenta: string, numeroCuenta: string, denominacion: string){
        this.cbu = cbu;
        this.tipoCuenta = tipoCuenta;
        this.numeroCuenta = numeroCuenta;
        this.denominacion = denominacion;
    }
}
