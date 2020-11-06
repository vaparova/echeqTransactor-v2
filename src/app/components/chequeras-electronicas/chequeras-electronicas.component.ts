import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosUsuario } from '../../models/datosUsuario';
import { DatosChequeras } from '../../models/datosChequeras';
import { DatosCuentas } from '../../models/datosCuentas';
import { VerificarClaveService } from '../../providers/verificar-clave.service';
import { ToastsService } from '../../providers/toasts.service';

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

  constructor(private user: UsuariosService,
              private verifClave: VerificarClaveService,
              private toast: ToastsService) {
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

  async activar(i: number){
    const cuenta = this.cuentas[i];
    const clave = this.chequeras[i].cheq.codigoActivacion;
    const resp = await this.verifClave.ingresarClaveActivación(clave);
    console.log(resp);
    if (!resp.data.resp){
      this.toast.mostrarToast(resp.data.arg, 'danger');
      return;
    }else{
      this.toast.mostrarToast(resp.data.arg, 'primary');
      setTimeout(() => {
        this.user.activarChequeraElectronica(this.chequeras[i], cuenta, 27364183807);
        this.toast.mostrarToast('Has activado tu chequera!', 'primary');
      }, 3000);
    }
  }
}
