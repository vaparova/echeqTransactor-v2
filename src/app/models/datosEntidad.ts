export class DatosEntidad {
    nombreEntidad: string;
    numeroEntidad: string;
    nombreSucursal: string;
    numeroSucursal: string;
    cpSucursal: string;

    constructor(
                nombreEntidad: string,
                numeroEntidad: string,
                nombreSucursal: string,
                numeroSucursal: string,
                cpSucursal: string
            ){
        this.nombreEntidad = nombreEntidad;
        this.numeroEntidad = numeroEntidad;
        this.nombreSucursal = nombreSucursal;
        this.numeroSucursal = numeroSucursal;
        this.cpSucursal = cpSucursal;
    }
}
