import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AlertasService } from 'src/app/providers/alertas.service';
import { SpinnerService } from 'src/app/providers/spinner.service';
import { ToastsService } from 'src/app/providers/toasts.service';
import { UsuariosService } from 'src/app/providers/usuarios.service';
import { VerificarPasswordService } from 'src/app/providers/verificar-password.service';
import { DatosSesion } from '../../models/datosSesion';
import { DatosUsuario } from '../../models/datosUsuario';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-echeq-generados',
  templateUrl: './echeq-generados.component.html',
  styleUrls: ['./echeq-generados.component.scss'],
})
export class EcheqGeneradosComponent implements OnInit {
  sesion: DatosSesion;
  usuario: DatosUsuario;
  echeqs: any[] = [];

  constructor(
    private user: UsuariosService,
    private toast: ToastsService,
    private spinner: SpinnerService,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private passw: VerificarPasswordService,
    private alertas: AlertasService,
    public actionSheetController: ActionSheetController
    ) {
      this.obtenerData();
      this.echeqs = this.user.getEcheqGenerados(this.usuario.usuario.datosPersonales.cuil);
      console.log(this.echeqs);

   }

  ngOnInit() {}

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      // header: 'Acciones',
      cssClass: 'my-custom-class',
      mode: 'md',
      buttons: [ {
        text: 'Ver Datos',
        icon: 'eye-outline',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Librar',
        icon: 'send-outline',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Editar',
        icon: 'pencil-outline',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Eliminar',
        role: 'destructive',
        icon: 'trash-outline',
        handler: () => {
          console.log('Delete clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  private obtenerData(){
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
