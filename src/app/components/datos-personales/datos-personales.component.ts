import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosUsuario } from '../../models/datosUsuario';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastsService } from '../../providers/toasts.service';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss'],
})
export class DatosPersonalesComponent implements OnInit {
  usuario: DatosUsuario;
  forma: FormGroup;
  readonly = true;


  constructor(private user: UsuariosService, private fb: FormBuilder, private toast: ToastsService) {
    this.usuario = this.user.obtenerUsuario(27364183807);
    console.log(this.usuario);
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
        tel: ['', [Validators.required, Validators.minLength(15)]],
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

  guardar(){
    if (this.forma.invalid){
      this.toast.mostrarToast('Formulario inválido!', 'danger');
      return;
    }
    this.actualizarUsuario();
    this.readonly = true;
    this.user.modificarUsuario(27364183807, this.usuario);
    this.toast.mostrarToast('Datos guardados!', 'primary');
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
