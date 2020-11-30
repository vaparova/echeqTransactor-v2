import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class VerificarClaveService {

  constructor(private alertController: AlertController ) { }

  async ingresarClaveActivación(clave: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Ingresa tu clave de activación',
      inputs: [
        {
          name: 'codigo',
          type: 'text',
          placeholder: 'Clave que te brindó tu banco'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: (data) => {
            console.log('Confirm Cancel');
            const rp = {  resp: false,
                          arg: 'Operacion cancelada!'};
            return rp;
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log(data);
            if (data.codigo === clave){
              const rp = {  resp: true,
                            arg: 'Clave correcta!'};
              return rp;
            }else{
              const rp = {  resp: false,
                arg: 'Clave incorrecta!'};
              return rp;
            }
          }
        }
      ]
    });

    await alert.present();
    const response = await alert.onDidDismiss();
    return response;
  }
}
