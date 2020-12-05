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

  ngOnInit() {}

  login(){
    if (this.forma.invalid){
      this.toast.mostrarToast('Formulario incorrecto!', 'danger');
      return;
    }
    this.item = this.user.loginFb(this.forma.controls.cuil.value);
    this.item.subscribe(action => {
      this.usuario = action.payload.val();
      if (this.usuario === null){
        this.toast.mostrarToast('Usuario Inexistente', 'danger');
        return;
      }
      if (this.verificarPass()){
        this.user.obtenerUsuarioFb(this.forma.controls.cuil.value);
        const sesion = new DatosSesion(this.forma.controls.cuil.value);
        this.user.guardarSesion(sesion);
        this.spinner.presentLoading();
        this.toast.mostrarToast('Ingreso Exitoso!', 'primary');
        this.navCtrl.navigateBack('/index');
      }else{
        this.toast.mostrarToast('Constraseña Incorrecta!', 'danger');
      }
    });
  }

  logout(){

  }

  verificarPass(): boolean{
    if (this.forma.controls.password.value === this.usuario.usuario.datosIngreso.password){
      return true;
    }else{
      return false;
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

  crearFormulario(): void{
    this.forma = this.fb.group({
        cuil: ['', [Validators.required, Validators.minLength(8)]],
        password: ['', [Validators.minLength(8),
        Validators.required]]
        });
  }
}
