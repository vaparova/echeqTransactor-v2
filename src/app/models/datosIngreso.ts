export class DatosIngreso {
    usuario: string;
    password: string;
    vencimiento: Date;

    constructor(usuario: string, password: string){
        this.usuario = usuario;
        this.password = password;
        this.vencimiento = this.calcularVencimiento();

    }

    // la contraseña caducará cada 3 meses
    calcularVencimiento(){
        const ahora = new Date();
        let mesVto = ahora.getMonth() + 3;
        let anioVto = ahora.getFullYear();

        if (mesVto > 11){
            mesVto = mesVto - 12;
            anioVto = anioVto + 1;
        }
        return new Date(
            anioVto,
            mesVto,
            ahora.getDate(),
            ahora.getHours(),
            ahora.getMinutes(),
        );
    }
}
