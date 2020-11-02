import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosUsuario } from '../../models/datosUsuario';

@Component({
  selector: 'app-enviar-token',
  templateUrl: './enviar-token.component.html',
  styleUrls: ['./enviar-token.component.scss'],
})
export class EnviarTokenComponent implements OnInit {
  applicationVerifier: firebase.auth.RecaptchaVerifier;
  usuario: DatosUsuario;
  tel: string;

  constructor(
              private modalCtrl: ModalController,
              private afb: AngularFireAuth,
              private alertCtrl: AlertController,
              private user: UsuariosService,
            ) {
              this.usuario = this.user.obtenerUsuario(27364183807);
              this.tel = `+${this.usuario.usuario.datosPersonales.tel.toString()}`;
              console.log(this.tel);
            }

  ngOnInit() {
    this.applicationVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    console.log(this.applicationVerifier);
  }

  comenzar(){
    firebase.auth().signInWithPhoneNumber(this.tel, this.applicationVerifier).then(
      async (confirmationResult) => {
        const prompt = await this.alertCtrl.create({
          cssClass: 'my-custom-class',
          header: 'Verificar Código',
          backdropDismiss: false,
          inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
          buttons: [
            { text: 'Cancelar',
              handler: data => {
                // usuario cancela el alert
                this.cerrar(false, 'Proceso token incompleto');
              }
            },
            { text: 'Verificar',
              handler: data => {
                confirmationResult
                .confirm(data.confirmationCode)
                .then((result) => {
                    // Token correcto
                    console.log(result.user);
                    this.cerrar(true, 'Token aceptado!', result.user.uid);
                })
                .catch((error) => {
                    // Token incorrecto
                    this.cerrar(false, 'Token incorrecto');
                });
              }
            }
          ]
        });
        await prompt.present();
    }).catch(resp => {
      // error de firebase
      console.log(resp);
      this.cerrar(false, 'Error al enviar SMS');
    });
  }

  cerrar(resp: boolean, text: string, id?: string){
    this.modalCtrl.dismiss({
      verificado: resp,
      argument: text,
      uid: id
    });
  }

}
