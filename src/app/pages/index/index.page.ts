import { Component, OnInit } from '@angular/core';
import { DatosSesion } from 'src/app/models/datosSesion';
import { DatosUsuario } from 'src/app/models/datosUsuario';
import { UsuariosService } from '../../providers/usuarios.service';
import { ToastsService } from '../../providers/toasts.service';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {

  sesion: DatosSesion;
  usuario: DatosUsuario;
  nombre = 'string';

  constructor(private user: UsuariosService, private toast: ToastsService,
              private navCtrl: NavController, private alertController: AlertController) {
    this.obtenerData();
   }

  ngOnInit() {
    this.nombre = this.usuario.usuario.datosPersonales.nombre + ' ' + this.usuario.usuario.datosPersonales.apellido;
  }

  async salir() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cerrar Sesión',
      message: '¿Estas seguro de cerrar tu sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Salir',
          handler: () => {
            console.log('Confirm Okay');
            this.navCtrl.navigateBack('/ingreso');
          }
        }
      ]
    });

    await alert.present();
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
