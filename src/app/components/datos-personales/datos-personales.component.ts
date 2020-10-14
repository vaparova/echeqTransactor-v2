import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosUsuario } from '../../models/datosUsuario';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss'],
})
export class DatosPersonalesComponent implements OnInit {
  usuario: DatosUsuario[];
  prueba: DatosUsuario;
  constructor(private user: UsuariosService) {
    this.usuario = this.user.verUsuarios();
    console.log(this.usuario);
    this.prueba = this.user.obtenerUsuario(20277852536);
    console.log(this.prueba);
   }

  ngOnInit() {}

}
