import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Notificacion } from '../../models/notificacion.model';
import { AlertasService } from '../../providers/alertas.service';
import { DatosAlertas } from '../../models/datosAlertas';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosSesion } from 'src/app/models/datosSesion';
import { DatosUsuario } from 'src/app/models/datosUsuario';
import { ToastsService } from '../../providers/toasts.service';


@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
})
export class NotificacionesComponent implements OnInit {

  sesion: DatosSesion;
  usuario: DatosUsuario;
  alertas: DatosAlertas[] = [];
  vacio = false;
  datosEcheq = false;
  datosCuenta = false;
  datosBeneficiario = false;

  constructor(private navCtrl: NavController, private user: UsuariosService, private toast: ToastsService) {
   this.cargarAlertas();
  }

  cargarAlertas(){
    this.obtenerData();
    this.alertas = this.usuario.usuario.datosAlertas;
    if (!this.alertas){
      this.vacio = true;
    }else{
      this.alertas.reverse();
    }
  }

  verDetalle(i: number) {
    this.alertas[i].leido = true;
    this.usuario.usuario.datosAlertas = this.alertas;
    this.user.modificarUsuario(this.sesion.cuil, this.usuario);
    console.log(`Index de alerta ${i}`);
    this.navCtrl.navigateForward(`/tab/index/alerta/ ${i}`);
  }

  ngOnInit() {
  }

  detalleEcheq(ev: any): void{
    const estado = ev.detail.value.toString();
    switch (estado){
      case 'datosEcheq':
        this.verDetalleEcheq(true, false, false);
        break;
      case 'datosCuenta':
        this.verDetalleEcheq(false, true, false);
        break;
      case 'datosBeneficiario':
        this.verDetalleEcheq(false, false, true);
        break;
    }
  }

  private verDetalleEcheq(datosEcheq: boolean, datosCuenta: boolean, datosBeneficiario: boolean): void{
    this.datosEcheq = datosEcheq;
    this.datosCuenta = datosCuenta;
    this.datosBeneficiario = datosBeneficiario;
  }


  private obtenerData(): void{
    const a = this.user.validarSesion();
    if (a){
      this.sesion = a;
      this.usuario = this.user.obtenerUsuario(this.sesion.cuil);
      console.log(`respta obtenerUsuario() US: ${this.usuario}`);
      console.log(this.usuario);
    }else{
      this.user.borrarSesion();
      this.toast.mostrarToast('Debes iniciar sesión', 'danger');
      this.navCtrl.navigateBack('/ingreso');
      console.log('error de login!');
    }
  }
}
