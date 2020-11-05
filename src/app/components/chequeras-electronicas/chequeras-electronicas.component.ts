import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosUsuario } from '../../models/datosUsuario';
import { DatosChequeras } from '../../models/datosChequeras';
import { DatosCuentas } from '../../models/datosCuentas';

@Component({
  selector: 'app-chequeras-electronicas',
  templateUrl: './chequeras-electronicas.component.html',
  styleUrls: ['./chequeras-electronicas.component.scss'],
})
export class ChequerasElectronicasComponent implements OnInit {
  usuario: DatosUsuario;
  cuentas: DatosCuentas [];
  chequeras = [];
  sinChequeras = false;

  constructor(private user: UsuariosService) {
    this.usuario = this.user.obtenerUsuario(27364183807);
    this.cuentas = this.usuario.usuario.datosCuentas;
    this.obtenerChequeras();
    if (this.chequeras.length === 0){
      this.sinChequeras = true;
    }
    console.log(this.chequeras);
  }

  ngOnInit() {}

  obtenerChequeras(){
    this.cuentas.forEach(resp => {
      resp.cuentas.chequeras.forEach((chequera: DatosChequeras) => {
        const obj = { cta: resp.cuentas.cuenta,
                      ent: resp.cuentas.entidad,
                      cheq: chequera};
        return this.chequeras.push(obj);
      });
    });
  }
}
