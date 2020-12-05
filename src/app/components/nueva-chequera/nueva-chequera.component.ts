import { Component, DoCheck, OnInit } from '@angular/core';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosUsuario } from '../../models/datosUsuario';
import { DatosCuentas } from '../../models/datosCuentas';
import { DatosChequeras } from '../../models/datosChequeras';
import { AlertController, NavController } from '@ionic/angular';
import { VerificarPasswordService } from '../../providers/verificar-password.service';
import { ToastsService } from '../../providers/toasts.service';
import { SpinnerService } from '../../providers/spinner.service';
import { DatosSesion } from '../../models/datosSesion';


@Component({
  selector: 'app-nueva-chequera',
  templateUrl: './nueva-chequera.component.html',
  styleUrls: ['./nueva-chequera.component.scss'],
})
export class NuevaChequeraComponent implements OnInit {
  usuario: DatosUsuario;
  cuentas: DatosCuentas [];
  cuentaCheq: DatosCuentas;
  paso = false;
  avance = '0.3';
  sesion: DatosSesion;

  constructor(private user: UsuariosService,
              private alertController: AlertController,
              private verifPass: VerificarPasswordService,
              private toast: ToastsService,
              private spinner: SpinnerService,
              private navCtrl: NavController) {
  }

  ngOnInit() {
    this.obtenerData();
    this.cuentas = this.usuario.usuario.datosCuentas;
    console.log(this.cuentas);
  }

  obtenerData(){
    this.sesion = this.user.obtenerSesion();
    if (this.sesion === null){
      this.toast.mostrarToast('Inicie sesión para continuar', 'danger');
      this.navCtrl.navigateBack('/ingreso');
      return;
    }
    this.usuario = this.user.obtenerUsuario(this.sesion.cuil);
  }

  async solicitar(i: number){
    const chequeras = this.cuentas[i].cuentas.chequeras;
    const verif = this.verificarChequeras(chequeras);

    if (verif.echeqDisponibles){
      await this.errorSolicitudChequera(verif.mje);
      return;
    }
    this.paso = true;
    this.avance = '0.8';
    this.cuentaCheq = this.cuentas[i];
  }

  async pedirChequera(){
    const resp =  await this.verifPass.verificarPass(this.sesion.cuil);
    console.log(resp);
    if (!resp.data.respuesta){
      this.toast.mostrarToast(resp.data.argumento, 'danger');
      this.navCtrl.navigateBack('/miCuenta/sector-mi-cuenta/5');
    }else{
      this.spinner.presentLoading();
      this.user.pedirChequera(this.cuentaCheq, this.sesion.cuil);
      setTimeout(() => {
      this.toast.mostrarToast(resp.data.argumento, 'primary');
      this.navCtrl.navigateBack('/miCuenta/sector-mi-cuenta/5');
      }, 2000);
    }
  }

  verificarChequeras(chequeras: DatosChequeras []){
    const activas: DatosChequeras[] = [];
    const verif = { echeqDisponibles: false,
                        mje: 'ok'
                      };

    chequeras.forEach(resp => {
      if (resp.estadoChequera === true){
        activas.push(resp);
      }
    });

    if (activas.length > 0){
    activas.forEach(resp => {
      if (resp.cantidadDisponible > 11){
        verif.echeqDisponibles = true;
        console.log(resp.cantidadDisponible);
        verif.mje = 'La cuenta seleccionada posee al menos una chequera electrónica con más de 10 echeqs disponibles';
      }
    });
    }else{
      verif.echeqDisponibles = true;
      verif.mje = 'La cuenta seleccionada no está activa';
    }
    return verif;
  }

  async errorSolicitudChequera(mje: string){
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class2',
        header: 'Error!',
        subHeader: 'No es posible pedir nueva chequera',
        message: mje,
        buttons: ['OK']
      });
      await alert.present();
    }
}
