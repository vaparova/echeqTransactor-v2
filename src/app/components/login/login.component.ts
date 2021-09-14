import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastsService } from '../../providers/toasts.service';
import { UsuariosService } from '../../providers/usuarios.service';
import { Observable } from 'rxjs';
import { DatosUsuario } from '../../models/datosUsuario';
import { NavController } from '@ionic/angular';
import { SpinnerService } from '../../providers/spinner.service';
import { DatosSesion } from '../../models/datosSesion';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  forma: FormGroup;
  datos = [
    { ver: false,
      tipo: 'password'},
    { ver: false,
      tipo: 'password'}
  ];
  item: Observable<any>;
  private usuario: DatosUsuario;


  constructor(private user: UsuariosService,
              private fb: FormBuilder,
              private toast: ToastsService,
              private navCtrl: NavController,
              private spinner: SpinnerService
              ) {
    this.crearFormulario();
              }

  ngOnInit() {
    this.user.borrarSesion();
  }

  async login(){
    this.spinner.presentLoading();
    if (!this.verificarForm()){
      return;
    }else{
      const u = await this.verificarUsuario();
      if (!u){
        return;
      }else{
        (this.verificarPass()) ? this.entrar() : this.passInvalida();
      }
    }
  }


  private entrar(){
    console.log('Datos corroborados. Ingresando al sistema....');
    const sesion = new DatosSesion(this.forma.controls.cuil.value);
    this.user.guardarSesion(sesion);
    this.user.setearUsuarioFb();
    this.spinner.presentLoading();
    this.toast.mostrarToast('Ingreso Exitoso!', 'primary');
    this.user.logOut();
    this.user.syncChanges();
    this.navCtrl.navigateBack('tab/index');
  }

  private async verificarUsuario(): Promise <boolean>{
    console.log(`Usuario a verificar: ${this.forma.controls.cuil.value}`);
    console.log('Verificando Usuario desde el componente....');
    this.user.verificarUsuarioFb(this.forma.controls.cuil.value);
    await this.delay(2000);
    return this.verificarRtaFb();
  }

  private verificarRtaFb(): boolean{
    if (this.user.verificarUsuarioBd()){
      console.log('Usuario Existe');
      return true;
    }else{
      console.log('Usuario Inexistente');
      this.resetFormulario();
      this.user.borrarSesion();
      this.toast.mostrarToast('Usuario Inexistente', 'danger');
      return false;
    }
  }

  private passInvalida(): void{
    this.resetFormulario();
    this.user.borrarSesion();
    this.toast.mostrarToast('Constraseña Incorrecta!', 'danger');
  }

  private verificarPass(): boolean{
    return this.user.verificarContrasena(this.forma.controls.password.value);
  }

  private verificarForm(): boolean{
    console.log('Verificando formulario....');
    if (this.forma.invalid){
      console.log('Formulario inválido');
      this.user.borrarSesion();
      this.resetFormulario();
      this.toast.mostrarToast('Formulario incorrecto!', 'danger');
      return false;
    }else{
      this.user.borrarSesion();
      console.log('Formulario válido');
      return true;
    }
  }

  visualizar(i: number){
    this.datos[i].ver = true;
    this.datos[i].tipo = 'text';
   }

  ocultar(i: number){
     this.datos[i].ver = false;
     this.datos[i].tipo = 'password';
   }

  private crearFormulario(): void{
    this.forma = this.fb.group({
        cuil: ['', [Validators.required, Validators.minLength(8)]],
        password: ['', [Validators.minLength(8),
        Validators.required]]
        });
  }

  private resetFormulario(): void{
    this.forma.controls.cuil.setValue('');
    this.forma.controls.password.setValue('');
  }

  private delay(ms: number) {
    console.log('Esperando...');
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
