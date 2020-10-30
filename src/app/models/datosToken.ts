export class DatosToken {
    claveToken: number;
    estado: boolean;

    constructor(){
        this.estado = false;
    }

    altaToken(clave: number){
        this.claveToken = clave;
        this.estado = true;
    }
}
