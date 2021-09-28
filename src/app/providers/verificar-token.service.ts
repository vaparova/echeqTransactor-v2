import { Injectable } from '@angular/core';
import { UsuariosService } from './usuarios.service';
import { AlertController, ModalController } from '@ionic/angular';
import { EnviarTokenComponent } from '../components/enviar-token/enviar-token.component';
import { ToastsService } from './toasts.service';

@Injectable({
  providedIn: 'root'
})
export class VerificarTokenService {
  tokenUser: number;

  constructor(private user: UsuariosService,
              private alertCtrl: AlertController,
              private modal: ModalController,
              private toast: ToastsService) { }


  async pedirToken(cuil: number): Promise<any>{
    return await this.verificarPin(cuil).then(resp => {
      console.log(resp);
      if (resp.data.respuesta){
        this.toast.mostrarToast(resp.data.argumento, 'primary');
        setTimeout( () => {
          this.verificarToken();
        }, 2000);
      }else{
        this.toast.mostrarToast(resp.data.argumento, 'danger');
      }
    });
  }

  private async verificarPin(cuil: number){
    this.tokenUser = this.user.obtenerUsuario(cuil).usuario.datosToken.claveToken;
    console.log(this.tokenUser);

    const prompt = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Ingresa tu PIN Token',
      backdropDismiss: false,
      inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code', type: 'password'}],
      buttons: [
        { text: 'Cancelar',
          handler: data => {
            // usuario cancela el alert
            return data.values = {respuesta: false,
              argumento: 'Operación Cancelada!'
            };
          }
        },
        { text: 'Verificar',
          handler: data => {
            console.log(data);
            if (data.confirmationCode === this.tokenUser){
              console.log('PIN');
              return data.values = {respuesta: true,
                              argumento: 'PIN correcto...'
                            };
            }else{
              console.log('contraseña incorrecta');
              return data.values = {respuesta: false,
                argumento: 'Contraseña incorrecta!'
              };
            }
          }
        }
      ]
    });
    await prompt.present();
    const response = await prompt.onDidDismiss();
    return response;
  }


  private async verificarToken(): Promise<any>{
    const tkn = await this.presentModal();
    if (tkn.data.verificado) {
        this.toast.mostrarToast('Clave Token Correcta!', 'primary');
    }else{
      this.toast.mostrarToast(tkn.data.argument, 'danger');
    }
  }


  private async presentModal() {
    const modal = await this.modal.create({
      component: EnviarTokenComponent,
      cssClass: 'my-custom-class'
    });
    await modal.present();
    const respuesta = await modal.onDidDismiss();
    return respuesta;
  }
}
