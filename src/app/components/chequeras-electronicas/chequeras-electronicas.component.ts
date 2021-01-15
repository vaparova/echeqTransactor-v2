import { Component, OnInit, DoCheck } from '@angular/core';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosUsuario } from '../../models/datosUsuario';
import { DatosChequeras } from '../../models/datosChequeras';
import { DatosCuentas } from '../../models/datosCuentas';
import { VerificarClaveService } from '../../providers/verificar-clave.service';
import { ToastsService } from '../../providers/toasts.service';
import { SpinnerService } from '../../providers/spinner.service';
import { NavController } from '@ionic/angular';
import { DatosSesion } from '../../models/datosSesion';



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
  sesion: DatosSesion;


  constructor(private user: UsuariosService,
              private verifClave: VerificarClaveService,
              private toast: ToastsService,
              private spinner: SpinnerService,
              private navCtrl: NavController,
              ) {

  }

  ngOnInit() {
    this.obtenerData();
    this.cuentas = this.usuario.usuario.datosCuentas;
    this.obtenerChequeras();
    if (this.chequeras.length === 0){
      this.sinChequeras = true;
    }
    console.log(this.chequeras);
  }

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
  // obtenerData(){
  //   this.sesion = this.user.obtenerSesion();
  //   if (this.sesion === null){
  //     this.toast.mostrarToast('Inicie sesión para continuar', 'danger');
  //     this.navCtrl.navigateBack('/ingreso');
  //     return;
  //   }
  //   this.usuario = this.user.obtenerUsuario(this.sesion.cuil);
  // }

  obtenerChequeras(){
    this.cuentas.forEach(resp => {
      if (resp.cuentas.chequeras){
        resp.cuentas.chequeras.forEach((chequera: DatosChequeras) => {
          const obj = { cta: resp.cuentas.cuenta,
                        ent: resp.cuentas.entidad,
                        cheq: chequera};
          return this.chequeras.push(obj);
        });
      }
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
      this.spinner.presentLoading();
      this.toast.mostrarToast(resp.data.arg, 'primary');
      setTimeout(() => {
        this.user.activarChequeraElectronica(this.chequeras[i], cuenta, this.sesion.cuil);
        this.toast.mostrarToast('Has activado tu chequera!', 'primary');
      }, 3000);
    }
  }

  nuevaChequera(){
    console.log('entro a la funcion nueva');
    this.navCtrl.navigateBack(`/tab/miCuenta/sector-mi-cuenta/6`);
  }
}
