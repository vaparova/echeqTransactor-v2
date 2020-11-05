export class DatosToken {
    claveToken: number;
    uid: string;
    estado: boolean;

    constructor(){
        this.estado = false;
    }

    altaToken(clave: number, uid: string){
        this.claveToken = clave;
        this.uid = uid;
        this.estado = true;
    }

    bajaToken(){
        this.claveToken = null;
        this.uid = '';
        this.estado = false;
    }
}
