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
    this.obtenerCuentas(); //
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
    console.log(cuenta); //
    const idx = this.buscarIndexCta(cuenta); //
    console.log(idx); //
    console.log(this.usuario.usuario.datosCuentas); //
    const clave = this.usuario.usuario.datosCuentas[idx].cuentas.claveActivacion; //
    console.log(clave);
    const resp = await this.verifClave.ingresarClaveActivación(clave);
    console.log(resp);
    if (!resp.data.resp){
      this.toast.mostrarToast(resp.data.arg, 'danger');
      return;
    }else{
      this.toast.mostrarToast(resp.data.arg, 'primary');
      setTimeout(() => {
        this.modificarUsuario(this.sesion.cuil, this.usuario, cuenta, 'vincular');
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
            this.modificarUsuario(this.sesion.cuil, this.usuario, cuenta, 'desvincular');
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

  private obtenerCuentas(): void{ //
    const ctasCtes: DatosCuentas[] = [];
    if (this.usuario.usuario.datosCuentas){
      this.usuario.usuario.datosCuentas.forEach( cta => {
        if (cta){
          ctasCtes.push(cta);
        }
      });
    }
    this.cuentas = ctasCtes;
  }

  private buscarIndexCta(cta: DatosCuentas): number {  //
    let index: number = null;
    Object.values(this.usuario.usuario.datosCuentas).forEach( cuenta => {
      if (cuenta){
        if ( cuenta.cuentas.cuenta.cbu === cta.cuentas.cuenta.cbu){
          index = this.usuario.usuario.datosCuentas.indexOf(cuenta);
        }
      }
    });
    return index;
  }

  private modificarUsuario(cuil: number, usuario: DatosUsuario, cuenta: DatosCuentas, accion: string): void{
    switch (accion){
      case('desvincular'): {
        this.user.desvincularCuenta(cuil, usuario, cuenta).then( () => {
          this.toast.mostrarToast('Cuenta desvinculada!', 'primary');
          console.log(this.usuario);
        }).catch ( () => {
          this.navCtrl.navigateBack('/tab/miCuenta');
          this.toast.mostrarToast('Error en BD!', 'danger');
        });
        break;
      }
      case('vincular'): {
        this.user.vincularCuenta(cuil, usuario, cuenta).then( () => {
          this.toast.mostrarToast('Has vinculado tu cuenta!', 'primary');
          console.log(this.usuario);
        }).catch ( () => {
          this.navCtrl.navigateBack('/tab/miCuenta');
          this.toast.mostrarToast(`Error en BD!`, 'danger');
        });
        break;
      }
    }
  }
}
