import { Component, OnInit } from '@angular/core';
import { DatosUsuario } from '../../models/datosUsuario';
import { UsuariosService } from '../../providers/usuarios.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidacionesService } from '../../providers/validaciones.service';

import { ModalController, NavController } from '@ionic/angular';
import { EnviarTokenComponent } from '../enviar-token/enviar-token.component';
import { ToastsService } from '../../providers/toasts.service';
import { VerificarPasswordService } from '../../providers/verificar-password.service';


@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
})
export class TokenComponent implements OnInit {

  usuario: DatosUsuario;
  forma: FormGroup;
  datos = [
    { ver: false,
      tipo: 'password'},
    { ver: false,
      tipo: 'password'},
  ];

  constructor(
                private user: UsuariosService,
                private fb: FormBuilder,
                private validadores: ValidacionesService,
                private modal: ModalController,
                private toast: ToastsService,
                private navCtrl: NavController,
                private passw: VerificarPasswordService
              ) {
    this.usuario = this.user.obtenerUsuario(27364183807);
    this.crearFormulario();
  }

  ngOnInit() {}

  crearFormulario(): void{
    this.forma = this.fb.group({
        pin: ['', [ Validators.minLength(4), Validators.maxLength(4), Validators.required]],
        repetir: ['', [Validators.minLength(4), Validators.maxLength(4), Validators.required]]
        },
        {
          validators: [
            this.validadores.passIguales('pin', 'repetir'),
          ]
        });
  }
  async EnviarToken(){
    if (this.forma.invalid){
      this.toast.mostrarToast('PIN inválido!', 'danger');
      return;
    }
    const tkn = await this.presentModal();
    if (tkn.data.verificado) {
      this.user.altaToken(2736418380, this.usuario, this.forma.controls.pin.value, tkn.data.uid);
      this.toast.mostrarToast('Alta de token exitoso!', 'primary');
      this.navCtrl.navigateForward(`/miCuenta`);
    }else{
    this.toast.mostrarToast(tkn.data.argument, 'danger');
    }
  }

  async presentModal() {
    const modal = await this.modal.create({
      component: EnviarTokenComponent,
      cssClass: 'my-custom-class'
    });
    await modal.present();
    const respuesta = await modal.onDidDismiss();
    return respuesta;
  }

  async bajaToken(){
    const pass = await this.passw.verificarPass(27364183807).then(resp => {
      console.log(resp);
      if (resp.data.respuesta){
        this.toast.mostrarToast(resp.data.argumento, 'primary');
        setTimeout( () => {
          this.toast.mostrarToast('Token dado de baja!', 'primary');
          this.user.bajaToken(27364183807, this.usuario);
          this.navCtrl.navigateForward(`/miCuenta`);
        }, 2000);
      }else{
        this.toast.mostrarToast(resp.data.argumento, 'danger');
      }
    });
  }

}





