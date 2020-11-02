import { Injectable } from '@angular/core';
import { DatosUsuario } from '../models/datosUsuario';
import { DatosPersonales } from '../models/datosPersonales';
import { DatosPostales } from '../models/datosPostales';
import { DatosIngreso } from '../models/datosIngreso';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuarios: DatosUsuario[] = [];

  constructor() {
    const user = new DatosUsuario(
      new DatosPersonales(
        'Martín',
        'Molina',
        'servicebelgrano@hotmail.com',
        20277852536,
        5492615874932
      ),
      new DatosPostales(
        'belgrano',
        519,
        'Godoy Cruz',
        'Mendoza',
        5501
      ),
      new DatosIngreso('molina1979', 'mol1979mol')
    );
    this.nuevoUsuario(user);

    const user2 = new DatosUsuario(
      new DatosPersonales(
        'Vanesa',
        'Romero',
        'vaparova_92@hotmail.com',
        27364183807,
        5492615058054
      ),
      new DatosPostales(
        'avellaneda',
        388,
        'Godoy Cruz',
        'Mendoza',
        5501
      ),
      new DatosIngreso('vaparova', 'vp1992rv')
    );
    this.nuevoUsuario(user2);
  }

  private nuevoUsuario(usuario: DatosUsuario){
    this.usuarios.push(usuario);
  }

  verUsuarios(){
    return this.usuarios;
  }

  obtenerUsuario(cuil: number){
   return this.usuarios.find( resp => resp.usuario.datosPersonales.cuil === cuil);
  }

  obtenerIndex(cuil: number){
    return this.usuarios.indexOf(this.obtenerUsuario(cuil));
  }

  modificarUsuario(cuil: number, userMod: DatosUsuario){
    const i = this.obtenerIndex(cuil);
    this.usuarios.splice(i, 1, userMod);
  }
}


