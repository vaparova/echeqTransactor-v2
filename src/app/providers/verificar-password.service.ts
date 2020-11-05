import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class VerificarPasswordService {

  private passwordUser: string;
  constructor(private alertCtrl: AlertController, private user: UsuariosService) {
   }

  async verificarPass(cuil: number){
    this.passwordUser = this.user.obtenerUsuario(cuil).usuario.datosIngreso.password;
    console.log(this.passwordUser);

    const prompt = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Ingresa tu contraseña',
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
            if (data.confirmationCode === this.passwordUser){
              console.log('Contraseña correcta');
              return data.values = {respuesta: true,
                              argumento: 'Contraseña correcta'
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
}
