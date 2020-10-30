import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosUsuario } from '../../models/datosUsuario';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ValidacionesService } from '../../providers/validaciones.service';
import { ToastsService } from '../../providers/toasts.service';
import { DatosIngreso } from '../../models/datosIngreso';
import { NavController } from '@ionic/angular';

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

  constructor(
                private user: UsuariosService,
                private fb: FormBuilder,
                private validadores: ValidacionesService,
                private toast: ToastsService,
                private navCtrl: NavController
              ){

    this.usuario = this.user.obtenerUsuario(27364183807);
    this.crearFormulario();
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
              this.validadores.passActual('actual', this.usuario.usuario.datosIngreso.password)
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
    this.user.modificarUsuario(27364183807, this.usuario);
    this.toast.mostrarToast('Contraseña modificada!', 'primary');
    console.log(this.usuario);
    this.navCtrl.navigateForward(`/miCuenta`);
    }

  private actualizarUsuario(){
    const vto = this.usuario.usuario.datosIngreso.calcularVencimiento();
    this.usuario.usuario.datosIngreso.password = this.forma.controls.nueva.value;
    this.usuario.usuario.datosIngreso.vencimiento = vto;
  }
  ngOnInit() {}

}
