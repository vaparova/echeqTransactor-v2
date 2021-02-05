import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosUsuario } from '../../models/datosUsuario';
import { DatosCuentas } from '../../models/datosCuentas';
import { AlertController, NavController } from '@ionic/angular';
import { ToastsService } from '../../providers/toasts.service';
import { VerificarPasswordService } from '../../providers/verificar-password.service';
import { VerificarClaveService } from '../../providers/verificar-clave.service';
import { DatosSesion } from '../../models/datosSesion';


@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss'],
})
export class CuentasComponent implements OnInit {

  usuario: DatosUsuario;
  cuentas: DatosCuentas[];
  sinCuentas = false;
  sesion: DatosSesion;

  constructor(  private user: UsuariosService,
                private alertController: AlertController,
                private toast: ToastsService,
                private passw: VerificarPasswordService,
                private verifClave: VerificarClaveService,
                private navCtrl: NavController) {

    this.obtenerData();
    this.cuentas = this.usuario.usuario.datosCuentas;
    if ( this.cuentas.length === 0){
      this.sinCuentas = true;
    }
   }

  ngOnInit() {}

  obtenerData(){
    const a = this.user.validarSesion();
    if (a){
      this.sesion = a;
      this.usuario = this.user.obtenerUsuario(this.sesion.cuil);
      console.log(`respta obtenerUsuario() US: ${this.usuario}`);
    }else{
      this.user.borrarSesion();
      this.toast.mostrarToast('Debes iniciar sesión', 'danger');
      this.navCtrl.navigateBack('/ingreso');
      console.log('error de login!');
    }
  }

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
        this.user.vincularCuenta(this.sesion.cuil, this.usuario, cuenta);
        this.toast.mostrarToast('Has vinculado tu cuenta!', 'primary');
      }, 3000);
    }
  }

  async desvincular(i: number){
    const cuenta = this.cuentas[i];
    const alerta = await this.alertaDesvincular();
    console.log(alerta.data.resp);

    if (alerta.data.resp){
      const pass = await this.passw.verificarPass(this.sesion.cuil).then(resp => {
        console.log(resp);
        if (resp.data.respuesta){
          this.toast.mostrarToast(resp.data.argumento, 'primary');
          setTimeout( () => {
            this.user.desvincularCuenta(this.sesion.cuil, this.usuario, cuenta);
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
