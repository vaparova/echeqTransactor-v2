import { Component, OnInit } from '@angular/core';
import { DatosUsuario } from '../../models/datosUsuario';
import { UsuariosService } from '../../providers/usuarios.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidacionesService } from '../../providers/validaciones.service';

import { ModalController, NavController } from '@ionic/angular';
import { EnviarTokenComponent } from '../enviar-token/enviar-token.component';
import { ToastsService } from '../../providers/toasts.service';
import { VerificarPasswordService } from '../../providers/verificar-password.service';
import { DatosSesion } from '../../models/datosSesion';


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
  sesion: DatosSesion;

  constructor(
                private user: UsuariosService,
                private fb: FormBuilder,
                private validadores: ValidacionesService,
                private modal: ModalController,
                private toast: ToastsService,
                private navCtrl: NavController,
                private passw: VerificarPasswordService
              ) {
    this.obtenerData();
    this.crearFormulario();
  }

  obtenerData(){
    this.sesion = this.user.obtenerSesion();
    if (this.sesion === null){
      this.toast.mostrarToast('Inicie sesión para continuar', 'danger');
      this.navCtrl.navigateBack('/ingreso');
    }else{
    this.usuario = this.user.obtenerUsuario(this.sesion.cuil);
    }
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
      this.user.altaToken(this.sesion.cuil, this.usuario, this.forma.controls.pin.value, tkn.data.uid);
      this.toast.mostrarToast('Alta de token exitoso!', 'primary');
      this.navCtrl.navigateBack('/miCuenta');
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
    const pass = await this.passw.verificarPass(this.sesion.cuil).then(resp => {
      console.log(resp);
      if (resp.data.respuesta){
        this.toast.mostrarToast(resp.data.argumento, 'primary');
        setTimeout( () => {
          this.toast.mostrarToast('Token dado de baja!', 'primary');
          this.user.bajaToken(this.sesion.cuil, this.usuario);
          this.navCtrl.navigateBack('/miCuenta');
        }, 2000);
      }else{
        this.toast.mostrarToast(resp.data.argumento, 'danger');
      }
    });
  }

}





