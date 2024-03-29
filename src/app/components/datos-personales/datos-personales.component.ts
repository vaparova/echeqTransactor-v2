import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosUsuario } from '../../models/datosUsuario';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastsService } from '../../providers/toasts.service';
import { DatosSesion } from '../../models/datosSesion';
import { NavController } from '@ionic/angular';
import { VerificarPasswordService } from '../../providers/verificar-password.service';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss'],
})
export class DatosPersonalesComponent implements OnInit {
  usuario: DatosUsuario;
  forma: FormGroup;
  sesion: DatosSesion;
  readonly = true;


  constructor(private user: UsuariosService,
              private fb: FormBuilder,
              private toast: ToastsService,
              private navCtrl: NavController,
              private passw: VerificarPasswordService
              ) {
    this.obtenerData();
    this.crearFormulario();
    this.cargarData();
  }
  ngOnInit() {}

  crearFormulario(): void{
    this.forma = this.fb.group({
      personales: this.fb.group({
        apellido: ['', [Validators.required, Validators.minLength(2)]],
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        cuil: ['', [Validators.required, Validators.minLength(9)]],
        email: ['', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.required]],
        tel: ['', [Validators.required, Validators.minLength(13)]],
      }),
      postales: this.fb.group({
        calle: ['', [Validators.required, Validators.minLength(3)]],
        altura: ['', [Validators.required, Validators.minLength(1)]],
        cp: ['', [Validators.required, Validators.minLength(4)]],
        localidad: ['', [Validators.required, Validators.minLength(3)]],
        provincia: ['', [Validators.required, Validators.minLength(3)]],
      })
    });
  }


  cargarData(): void { // aca debería formar formsgroup para datos personales y postales, de forma
    // que pueda obtener dos array distintos para luego poder actualizar los datos en el servicio
    this.forma.reset({
      personales: {
        nombre: this.usuario.usuario.datosPersonales.nombre,
        apellido: this.usuario.usuario.datosPersonales.apellido,
        cuil: this.usuario.usuario.datosPersonales.cuil,
        email: this.usuario.usuario.datosPersonales.email,
        tel: this.usuario.usuario.datosPersonales.tel,
      },
      postales: {
        calle: this.usuario.usuario.datosPostales.calle,
        altura: this.usuario.usuario.datosPostales.altura,
        cp: this.usuario.usuario.datosPostales.cp,
        localidad: this.usuario.usuario.datosPostales.localidad,
        provincia: this.usuario.usuario.datosPostales.provincia,
      }
    });
  }


  editar(){
    this.readonly = false;
  }

  async guardar(){
    if (this.forma.invalid){
      console.log(this.forma);
      this.toast.mostrarToast('Formulario inválido!', 'danger');
      return;
    }
    this.actualizarUsuario();
    this.readonly = true;

    const pass = await this.passw.verificarPass(this.sesion.cuil).then(resp => {
      console.log(resp);
      if (resp.data.respuesta){
        this.toast.mostrarToast(resp.data.argumento, 'primary');
        setTimeout( () => {
          this.modificarUsuario();
        }, 2000);
      }else{
        this.toast.mostrarToast(resp.data.argumento, 'danger');
      }
    });
  }

  private obtenerData(){
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

  private actualizarUsuario(){
    const valores = Object.values(this.forma.value);
    Object.keys(this.usuario.usuario.datosPersonales).forEach( (atributo, indice) => {
      this.usuario.usuario.datosPersonales[atributo] = valores[0][atributo];
    });
    Object.keys(this.usuario.usuario.datosPostales).forEach( (atributo, indice) => {
      this.usuario.usuario.datosPostales[atributo] = valores[1][atributo];
    });
  }

  private modificarUsuario(): void{
    this.user.modificarUsuario(this.sesion.cuil, this.usuario).then( () => {
      this.toast.mostrarToast('Datos modificados!', 'primary');
      console.log(this.usuario);
    }).catch ( () => {
      this.toast.mostrarToast('Error en BD!', 'danger');
    });
  }

}

// // esto se podría mandar a un pipe
// for (const prop in this.usuario.usuario.datosPersonales) {
//   if (this.usuario.usuario.datosPersonales.hasOwnProperty(prop)) {
//     this.otro.push(
//       {
//         clave: prop,
//         valor: this.usuario.usuario.datosPersonales[prop],
//         tipo: typeof this.usuario.usuario.datosPersonales[prop]
//       }
//     );
//   }
// }
