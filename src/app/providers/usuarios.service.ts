import { Injectable } from '@angular/core';
import { DatosUsuario } from '../models/datosUsuario';
import { DatosPersonales } from '../models/datosPersonales';
import { DatosPostales } from '../models/datosPostales';

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
        155874932
      ),
      new DatosPostales(
        'belgrano',
        519,
        'Godoy Cruz',
        'Mendoza',
        5501
      )
    );
    this.nuevoUsuario(user);
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
}


