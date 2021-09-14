import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosUsuario } from '../../models/datosUsuario';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ValidacionesService } from '../../providers/validaciones.service';
import { ToastsService } from '../../providers/toasts.service';
import { DatosIngreso } from '../../models/datosIngreso';
import { NavController } from '@ionic/angular';
import { DatosSesion } from '../../models/datosSesion';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {

  usuario: DatosUsuario;
  forma: FormGroup;
  datos = [
    { ver: false,
      tipo: 'password'},
    { ver: false,
      tipo: 'password'},
    { ver: false,
      tipo: 'password'}
  ];
  sesion: DatosSesion;

 constructor(
                private user: UsuariosService,
                private fb: FormBuilder,
                private validadores: ValidacionesService,
                private toast: ToastsService,
                private navCtrl: NavController
              ){

    this.obtenerData();
    this.crearFormulario();
  }

  obtenerData(){
    const a = this.user.validarSesion();
    if (a){
      this.sesion = a;
      this.usuario = this.user.obtenerUsuario(this.sesion.cuil);
      console.log(`respta obtenerUsuario() US: ${this.usuario}`);
    }else{
      this.user.borrarSesion();
      this.toast.mostrarToast('Debes iniciar sesión', 'danger');
      this.navCtrl.navigateBack('/ingreso');
      console.log('error de login!');
    }
  }

  crearFormulario(): void{
      this.forma = this.fb.group({
          actual: ['', [Validators.required, Validators.minLength(8)]],
          nueva: ['', [Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'), Validators.minLength(8),
          Validators.required]],
          repetir: ['', [Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'), Validators.minLength(8),
          Validators.required]]
          },
          {
            validators: [
              this.validadores.passIguales('nueva', 'repetir'),
              this.validadores.passActual('actual', this.usuario.usuario.datosIngreso.password),
              this.validadores.passNueva('nueva', this.usuario.usuario.datosIngreso.password),
            ]
          });
    }

  visualizar(i: number){
   this.datos[i].ver = true;
   this.datos[i].tipo = 'text';
  }

  ocultar(i: number){
    this.datos[i].ver = false;
    this.datos[i].tipo = 'password';
  }

  guardar(){
    console.log(this.forma);
    if (this.forma.invalid){
      this.toast.mostrarToast('Contraseñas inválidas!', 'danger');
      return;
    }
    this.actualizarUsuario();
    this.modificarUsuario();
  }

  private actualizarUsuario(){
    const psw = new DatosIngreso(this.forma.controls.nueva.value);
    psw.calcularVencimiento();
    this.usuario.usuario.datosIngreso = psw;
  }

  private modificarUsuario(): void{
    this.user.modificarUsuario(this.sesion.cuil, this.usuario).then( () => {
      this.toast.mostrarToast('Contraseña modificada!', 'primary');
      this.cleanForm();
      this.navCtrl.navigateForward(`/tab/miCuenta`);
      console.log(this.usuario);
    }).catch ( () => {
      this.toast.mostrarToast('Error en BD!', 'danger');
    });
  }

  private cleanForm(){
    this.forma.reset();
  }

  ngOnInit() {}

}
