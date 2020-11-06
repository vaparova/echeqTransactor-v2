import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosUsuario } from '../../models/datosUsuario';
import { DatosCuentas } from '../../models/datosCuentas';
import { AlertController } from '@ionic/angular';
import { ToastsService } from '../../providers/toasts.service';
import { VerificarPasswordService } from '../../providers/verificar-password.service';
import { VerificarClaveService } from '../../providers/verificar-clave.service';


@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss'],
})
export class CuentasComponent implements OnInit {

  usuario: DatosUsuario;
  cuentas: DatosCuentas[];
  sinCuentas = false;

  constructor(  private user: UsuariosService,
                private alertController: AlertController,
                private toast: ToastsService,
                private passw: VerificarPasswordService,
                private verifClave: VerificarClaveService) {

    this.usuario = this.user.obtenerUsuario(27364183807);
    this.cuentas = this.usuario.usuario.datosCuentas;
    if ( this.cuentas.length === 0){
      this.sinCuentas = true;
    }
   }

  ngOnInit() {}

  async vincular(i: number){
    const cuenta = this.cuentas[i];
    const clave = this.usuario.usuario.datosCuentas[i].cuentas.claveActivación;
    const resp = await this.verifClave.ingresarClaveActivación(clave);
    console.log(resp);
    if (!resp.data.resp){
      this.toast.mostrarToast(resp.data.arg, 'danger');
      return;
    }else{
      this.toast.mostrarToast(resp.data.arg, 'primary');
      setTimeout(() => {
        this.user.vincularCuenta(2736418380, this.usuario, cuenta);
        this.toast.mostrarToast('Has vinculado tu cuenta!', 'primary');
      }, 3000);
    }
  }

  async desvincular(i: number){
    const cuenta = this.cuentas[i];
    const alerta = await this.alertaDesvincular();
    console.log(alerta.data.resp);

    if (alerta.data.resp){
      const pass = await this.passw.verificarPass(27364183807).then(resp => {
        console.log(resp);
        if (resp.data.respuesta){
          this.toast.mostrarToast(resp.data.argumento, 'primary');
          setTimeout( () => {
            this.user.desvincularCuenta(2736418380, this.usuario, cuenta);
            this.toast.mostrarToast('Cuenta desvinculada!', 'primary');
          }, 2000);
        }else{
          this.toast.mostrarToast(resp.data.argumento, 'danger');
        }
      });
    }else{
      this.toast.mostrarToast(alerta.data.arg, 'danger');
    }
  }


  async alertaDesvincular() {
    const alert = await this.alertController.create({
      header: 'Desvincular Cuenta',
      message: 'Este proceso eliminará las chequeras que tengas asociadas a esta cuenta, ¿Estas seguro?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            const rp = {  resp: false,
              arg: 'Operacion cancelada!'};
            return rp;
          }
        }, {
          text: 'Ok',
          handler: () => {
            const rp = {  resp: true,
              arg: 'Operacion confirmada!'};
            return rp;
          }
        }
      ]
    });

    await alert.present();
    const response = await alert.onDidDismiss();
    return response;
  }
}
