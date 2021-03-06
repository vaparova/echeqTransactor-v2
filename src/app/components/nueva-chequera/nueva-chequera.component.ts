import { Component, OnInit } from '@angular/core';
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
  cuentas: DatosCuentas[] = [];
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
    const ctas = this.usuario.usuario.datosCuentas;
    console.log(ctas);
    ctas.forEach(resp => {
      if (resp.cuentas.estado === true){
        this.cuentas.push(resp);
      }
    });
    console.log(this.cuentas);
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

  async solicitar(i: number){
    try{
      const chequeras = this.cuentas[i].cuentas.chequeras;
      const verif = this.verificarChequeras(chequeras);
      if (verif.echeqDisponibles){
        await this.errorSolicitudChequera(verif.mje);
        return;
      }
      this.paso = true;
      this.avance = '0.8';
      this.cuentaCheq = this.cuentas[i];
    } catch (error) {
      console.log('La cuenta no posee chequeras, acá debería poder solicitarla');
      console.log(error);
      this.paso = true;
      this.avance = '0.8';
      this.cuentaCheq = this.cuentas[i];
    }
  }

  async pedirChequera(){
    const resp =  await this.verifPass.verificarPass(this.sesion.cuil);
    console.log(resp);
    if (!resp.data.respuesta){
      this.toast.mostrarToast(resp.data.argumento, 'danger');
      this.navCtrl.navigateBack('/tab/miCuenta/sector-mi-cuenta/5');
    }else{
      this.spinner.presentLoading();
      setTimeout(() => {
        this.modificarUsuario(this.cuentaCheq, this.sesion.cuil, resp.data.argumento);
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
      if (resp.estadoChequera === false){
        verif.echeqDisponibles = true;
        verif.mje = 'Ya posees un pedido de chequera para esta cuenta';
        return;
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

  private modificarUsuario(cta: DatosCuentas, cuil: number, resp: any): void{
    this.user.pedirChequera(cta, cuil).then( () => {
      this.toast.mostrarToast(resp, 'primary');
      this.navCtrl.navigateBack('/tab/miCuenta/sector-mi-cuenta/5');
    }).catch ( () => {
      this.toast.mostrarToast('Error en BD!', 'danger');
    });
  }
}
