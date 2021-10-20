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

  return await this.verificarPin(cuil).then( (resp: any) => {
      console.log(resp);
      if (resp.data.respuesta === true){
        return this.presentModal();
      }else{
        console.log('se cancelo pin');
        throw new Error('Algo falló');
      }
    }).then ( (tkn: any) => {
      console.log(tkn);
      if (tkn.data.verificado) {
        this.toast.mostrarToast('Clave Token Correcta!', 'primary');
        return tkn;
      }else{
      this.toast.mostrarToast(tkn.data.argument, 'danger');
      throw new Error('Algo falló');
      }
    }).catch( () => {
      console.log('se ejecutó catch de servicio token');
      this.toast.mostrarToast('Error en Token :(', 'danger');
      throw new Error('Algo falló');
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
              console.log('PIN correcto');
              return data.values = {respuesta: true,
                              argumento: 'PIN correcto...'
                            };
            }else{
              console.log('PIN incorrecto');
              return data.values = {respuesta: false,
                argumento: 'PIN incorrecto!'
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
