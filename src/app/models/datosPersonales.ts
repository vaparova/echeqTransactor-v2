export class DatosPersonales {
    nombre: string;
    apellido: string;
    email: string;
    cuil: number;
    tel: number;

     constructor(nombre: string, apellido: string, email: string, cuil: number, tel: number) {
         this.nombre = nombre;
         this.apellido = apellido;
         this.email = email;
         this.cuil = cuil;
         this.tel = tel;
    }
}
