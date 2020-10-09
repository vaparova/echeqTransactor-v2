export class DatosPostales {
    calle: string;
    altura: number;
    localidad: string;
    provincia: string;
    cp: number;

    constructor(calle: string, altura: number, localidad: string, provincia: string, cp: number){
        this.calle = calle;
        this.altura = altura;
        this.localidad = localidad;
        this.provincia = provincia;
        this.cp = cp;
    }
}
